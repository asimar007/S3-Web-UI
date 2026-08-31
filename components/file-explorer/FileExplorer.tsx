"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import BucketInfo from "./BucketInfo";
import StatsBar from "./StatsBar";
import { useVault } from "@/components/vault-provider";
import FileListHeader from "./FileListHeader";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import UploadProgress from "./UploadProgress";
import EmptyState from "./EmptyState";
import CreateFolderButton from "./CreateFolderButton";
import CreateFolderModal from "./CreateFolderModal";
import { S3Response } from "./types";
import { formatFileSize } from "./utils";

export default function FileExplorer() {
  const [data, setData] = useState<S3Response>({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [folderContents, setFolderContents] = useState<Map<string, S3Response>>(
    new Map(),
  );
  const [loadingFolders, setLoadingFolders] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  const { credentials, bucket } = useVault();

  useEffect(() => {
    if (credentials) {
      fetchObjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    if (!credentials) {
      throw new Error("Vault is locked or missing credentials");
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "x-aws-access-key-id": credentials.accessKeyId,
        "x-aws-secret-access-key": credentials.secretAccessKey,
      },
    });
  };

  const fetchObjects = async () => {
    if (!credentials) return;
    setLoading(true);
    setError(null);
    const response = await authenticatedFetch("/api/objects");
    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error || "Failed to fetch objects");
      setData({ files: [], folders: [] });
      setLoading(false);
      return;
    }
    const result: S3Response = await response.json();
    setData(result || { files: [], folders: [] });
    setLoading(false);
  };

  const fetchFolderContents = async (folderPath: string) => {
    if (folderContents.has(folderPath)) return;
    if (!credentials) return;

    setLoadingFolders((prev) => new Set(prev).add(folderPath));
    const response = await authenticatedFetch(
      `/api/objects?prefix=${encodeURIComponent(folderPath)}`,
    );
    if (response.ok) {
      const result: S3Response = await response.json();
      setFolderContents((prev) => new Map(prev).set(folderPath, result));
    }
    setLoadingFolders((prev) => {
      const newSet = new Set(prev);
      newSet.delete(folderPath);
      return newSet;
    });
  };

  const toggleFolder = async (folderPath: string) => {
    if (expandedFolders.has(folderPath)) {
      setExpandedFolders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(folderPath);
        return newSet;
      });
    } else {
      setExpandedFolders((prev) => new Set(prev).add(folderPath));
      await fetchFolderContents(folderPath);
    }
  };

  const calculateFolderSize = (folderPath: string): number => {
    const contents = folderContents.get(folderPath);
    if (!contents) return 0;

    const fileSize = contents.files
      .filter((file) => file.Size > 0)
      .reduce((total, file) => total + file.Size, 0);

    const nestedFolderSize = contents.folders.reduce(
      (total, nestedFolder) => total + calculateFolderSize(nestedFolder),
      0,
    );

    return fileSize + nestedFolderSize;
  };

  const getFolderDisplaySize = (folderPath: string): string => {
    if (!folderContents.get(folderPath)) return "—";
    const totalSize = calculateFolderSize(folderPath);
    return totalSize > 0 ? formatFileSize(totalSize) : "—";
  };

  const refreshFolder = async (folderPath: string) => {
    if (!folderContents.has(folderPath)) return;
    setFolderContents((prev) => {
      const newMap = new Map(prev);
      newMap.delete(folderPath);
      return newMap;
    });
    await fetchFolderContents(folderPath);
  };

  const handleFileUpload = async (folderPath: string, file: File) => {
    if (!credentials) return;
    const fullKey = `${folderPath}${file.name}`;
    setUploadingFiles((prev) => new Set(prev).add(fullKey));

    const uploadResponse = await authenticatedFetch(
      `/api/upload?key=${encodeURIComponent(fullKey)}`,
    );
    if (uploadResponse.ok) {
      const { url } = await uploadResponse.json();

      const putResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (putResponse.ok) {
        await refreshFolder(folderPath);
        if (folderPath === "") {
          await fetchObjects();
        }
      }
    }

    setUploadingFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fullKey);
      return newSet;
    });
  };

  const triggerFileUpload = (folderPath: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file) => {
          handleFileUpload(folderPath, file);
        });
      }
    };
    input.click();
  };

  const handleFileDownload = async (fileKey: string) => {
    if (!credentials) return;
    const response = await authenticatedFetch(
      `/api/download?key=${encodeURIComponent(fileKey)}`,
    );
    if (!response.ok) return;

    const { url } = await response.json();
    window.location.href = url;
  };

  const handleFileDelete = async (fileKey: string) => {
    if (!credentials) return;
    if (
      !confirm(`Are you sure you want to delete "${fileKey.split("/").pop()}"?`)
    ) {
      return;
    }

    setDeletingFiles((prev) => new Set(prev).add(fileKey));

    try {
      const response = await authenticatedFetch(
        `/api/delete?key=${encodeURIComponent(fileKey)}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        await fetchObjects();
        await refreshFolder(fileKey.substring(0, fileKey.lastIndexOf("/") + 1));
      } else {
        const errorData = await response.json();
        alert(`Failed to delete file: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete file. Please try again.");
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileKey);
        return newSet;
      });
    }
  };

  const handleCreateFolder = async (folderName: string) => {
    if (!credentials) return;
    const folderKey = `${folderName}/`;

    const response = await authenticatedFetch(
      `/api/upload?key=${encodeURIComponent(folderKey)}`,
    );

    if (response.ok) {
      const { url } = await response.json();

      const putResponse = await fetch(url, {
        method: "PUT",
        body: "",
        headers: { "Content-Type": "application/x-directory" },
      });

      if (putResponse.ok) {
        await fetchObjects();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => fetchObjects()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full p-2 sm:p-4">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <BucketInfo bucketInfo={bucket} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <CreateFolderButton
              onCreateFolder={() => setIsCreateFolderModalOpen(true)}
              variant="outline"
              size="sm"
              className="hover:bg-muted hover:text-foreground transition-colors text-xs sm:text-sm"
            />
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerFileUpload("");
              }}
              className="flex items-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Upload Files</span>
              <span className="xs:hidden">Upload</span>
            </Button>
          </div>
        </div>

        <StatsBar data={data} uploadingFiles={uploadingFiles} />
      </div>

      <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border overflow-hidden">
        <FileListHeader />

        <div className="divide-y">
          {data.folders &&
            data.folders.map((folder) => (
              <FolderItem
                key={folder}
                folder={folder}
                expandedFolders={expandedFolders}
                folderContents={folderContents}
                loadingFolders={loadingFolders}
                deletingFiles={deletingFiles}
                onToggle={toggleFolder}
                onUpload={triggerFileUpload}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
                getFolderDisplaySize={getFolderDisplaySize}
              />
            ))}

          {data.files &&
            data.files
              .filter((file) => file.Size > 0)
              .map((file) => (
                <FileItem
                  key={file.Key}
                  file={file}
                  onDownload={handleFileDownload}
                  onDelete={handleFileDelete}
                  isDeleting={deletingFiles.has(file.Key)}
                />
              ))}

          <UploadProgress uploadingFiles={uploadingFiles} />

          <EmptyState
            data={data}
            uploadingFiles={uploadingFiles}
            onUpload={() => triggerFileUpload("")}
          />
        </div>
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}
