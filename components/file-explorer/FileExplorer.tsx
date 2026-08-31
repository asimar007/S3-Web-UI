"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Loader2, FolderPlus } from "lucide-react";
import BucketInfo from "./BucketInfo";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import StatsBar from "./StatsBar";
import { useVault } from "@/components/vault-provider";
import FileListHeader from "./FileListHeader";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import UploadProgress from "./UploadProgress";
import EmptyState from "./EmptyState";
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
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set(),
  );
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
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

  // Mutations revalidate in the background: flipping `loading` here would
  // unmount the whole list and read as a page reload.
  const fetchObjects = async ({ silent = false } = {}) => {
    if (!credentials) return;
    if (!silent) setLoading(true);
    setError(null);
    const response = await authenticatedFetch("/api/objects");
    if (!response.ok) {
      const errorData = await response.json();
      if (!silent) {
        setError(errorData.error || "Failed to fetch objects");
        setData({ files: [], folders: [] });
      }
      setLoading(false);
      return;
    }
    const result: S3Response = await response.json();
    setData(result || { files: [], folders: [] });
    setLoading(false);
  };

  const fetchFolderContents = async (folderPath: string, force = false) => {
    if (!credentials) return;
    if (!force && folderContents.has(folderPath)) return;

    if (!force) {
      setLoadingFolders((prev) => new Set(prev).add(folderPath));
    }
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

  /** Applies a local edit to whichever listing owns `prefix` ("" is the root). */
  const patchScope = (prefix: string, fn: (scope: S3Response) => S3Response) => {
    if (prefix === "") {
      setData(fn);
      return;
    }
    setFolderContents((prev) => {
      const current = prev.get(prefix);
      if (!current) return prev;
      return new Map(prev).set(prefix, fn(current));
    });
  };

  const revalidate = async (prefix: string) => {
    if (prefix === "") await fetchObjects({ silent: true });
    else if (folderContents.has(prefix)) await fetchFolderContents(prefix, true);
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

  const handleFileUpload = async (folderPath: string, file: File) => {
    if (!credentials) return;
    const fullKey = `${folderPath}${file.name}`;
    setUploadingFiles((prev) => new Set(prev).add(fullKey));

    try {
      const uploadResponse = await authenticatedFetch(
        `/api/upload?key=${encodeURIComponent(fullKey)}`,
      );
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        toast.error(errorData.error || `Could not upload ${file.name}`);
        return;
      }

      const { url } = await uploadResponse.json();
      const putResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!putResponse.ok) {
        toast.error(`Could not upload ${file.name}`);
        return;
      }

      patchScope(folderPath, (scope) => ({
        ...scope,
        files: [
          ...scope.files.filter((f) => f.Key !== fullKey),
          {
            Key: fullKey,
            Size: file.size,
            LastModified: new Date().toISOString(),
          },
        ],
      }));
      toast.success(`Uploaded ${file.name}`);
      revalidate(folderPath);
    } catch (error) {
      console.error(error);
      toast.error(`Could not upload ${file.name}`);
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fullKey);
        return newSet;
      });
    }
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
    setDownloadingFiles((prev) => new Set(prev).add(fileKey));

    try {
      const response = await authenticatedFetch(
        `/api/download?key=${encodeURIComponent(fileKey)}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Could not prepare that download");
        return;
      }

      // Handing the signed URL to a detached iframe keeps an S3 error page from
      // replacing the explorer, which navigating the tab directly would do.
      const { url } = await response.json();
      const frame = document.createElement("iframe");
      frame.style.display = "none";
      frame.src = url;
      document.body.appendChild(frame);
      setTimeout(() => frame.remove(), 60_000);
    } catch (error) {
      console.error(error);
      toast.error("Could not prepare that download");
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileKey);
        return newSet;
      });
    }
  };

  const handleFileDelete = async (fileKey: string) => {
    if (!credentials) return;
    const prefix = fileKey.substring(0, fileKey.lastIndexOf("/") + 1);
    setPendingDelete(null);
    setDeletingFiles((prev) => new Set(prev).add(fileKey));

    // Drop the row now; a failed request puts it back via revalidate below.
    patchScope(prefix, (scope) => ({
      ...scope,
      files: scope.files.filter((f) => f.Key !== fileKey),
    }));

    try {
      const response = await authenticatedFetch(
        `/api/delete?key=${encodeURIComponent(fileKey)}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        toast.success(`Deleted ${fileKey.split("/").pop()}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Could not delete that file");
        await revalidate(prefix);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not delete that file");
      await revalidate(prefix);
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

    if (data.folders.includes(folderKey)) {
      toast.error(`"${folderName}" already exists`);
      return;
    }

    setData((prev) => ({
      ...prev,
      folders: [...prev.folders, folderKey].sort(),
    }));

    const undo = () =>
      setData((prev) => ({
        ...prev,
        folders: prev.folders.filter((f) => f !== folderKey),
      }));

    try {
      const response = await authenticatedFetch(
        `/api/upload?key=${encodeURIComponent(folderKey)}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Could not create that folder");
        undo();
        return;
      }

      const { url } = await response.json();
      const putResponse = await fetch(url, {
        method: "PUT",
        body: "",
        headers: { "Content-Type": "application/x-directory" },
      });

      if (putResponse.ok) {
        toast.success(`Created ${folderName}`);
      } else {
        toast.error("Could not create that folder");
        undo();
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not create that folder");
      undo();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4">
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col items-start gap-3">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => fetchObjects()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateFolderModalOpen(true)}
              className="flex items-center gap-2 hover:bg-muted hover:text-foreground transition-colors text-xs sm:text-sm"
            >
              <FolderPlus className="h-4 w-4" />
              Create Folder
            </Button>
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
                downloadingFiles={downloadingFiles}
                uploadingFiles={uploadingFiles}
                onToggle={toggleFolder}
                onUpload={triggerFileUpload}
                onDownload={handleFileDownload}
                onDelete={setPendingDelete}
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
                  onDelete={setPendingDelete}
                  isDeleting={deletingFiles.has(file.Key)}
                  isDownloading={downloadingFiles.has(file.Key)}
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

      <ConfirmDeleteModal
        fileKey={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && handleFileDelete(pendingDelete)}
      />
    </div>
  );
}
