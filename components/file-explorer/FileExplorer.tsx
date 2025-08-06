"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import BucketInfo from "./BucketInfo";
import StatsBar from "./StatsBar";
import FileListHeader from "./FileListHeader";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import UploadProgress from "./UploadProgress";
import EmptyState from "./EmptyState";
import CreateFolderButton from "./CreateFolderButton";
import CreateFolderModal from "./CreateFolderModal";
import { S3Response, BucketInfoType } from "./types";
import { formatFileSize } from "./utils";

export default function FileExplorer() {
  const currentPath = ""; // Always empty string since no navigation
  const [data, setData] = useState<S3Response>({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [folderContents, setFolderContents] = useState<Map<string, S3Response>>(
    new Map()
  );
  const [loadingFolders, setLoadingFolders] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [bucketInfo, setBucketInfo] = useState<BucketInfoType | null>(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  const fetchObjects = async (prefix: string = "") => {
    setLoading(true);
    setError(null);
    const url = `/api/objects${
      prefix ? `?prefix=${encodeURIComponent(prefix)}` : ""
    }`;
    const response = await fetch(url);
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

  const fetchBucketInfo = async () => {
    const response = await fetch("/api/user/credentials");
    if (response.ok) {
      const data = await response.json();
      setBucketInfo({
        bucketName: data.bucketName,
        awsRegion: data.awsRegion,
      });
    }
  };

  useEffect(() => {
    fetchObjects(currentPath);
    fetchBucketInfo();
  }, []); // No dependencies needed since currentPath is static

  const fetchFolderContents = async (folderPath: string) => {
    if (folderContents.has(folderPath)) return;

    setLoadingFolders((prev) => new Set(prev).add(folderPath));
    const url = `/api/objects?prefix=${encodeURIComponent(folderPath)}`;
    const response = await fetch(url);
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
    const isExpanded = expandedFolders.has(folderPath);

    if (isExpanded) {
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

    // Sum up all file sizes in this folder
    const fileSize = contents.files
      .filter((file) => file.Size > 0)
      .reduce((total, file) => total + file.Size, 0);

    // Recursively calculate sizes of nested folders
    const nestedFolderSize = contents.folders.reduce((total, nestedFolder) => {
      return total + calculateFolderSize(nestedFolder);
    }, 0);

    return fileSize + nestedFolderSize;
  };

  const getFolderDisplaySize = (folderPath: string): string => {
    const contents = folderContents.get(folderPath);
    if (!contents) return "—";

    const totalSize = calculateFolderSize(folderPath);
    return totalSize > 0 ? formatFileSize(totalSize) : "—";
  };

  const handleFileUpload = async (folderPath: string, file: File) => {
    const fullKey = `${folderPath}${file.name}`;
    setUploadingFiles((prev) => new Set(prev).add(fullKey));

    // Get presigned URL
    const uploadResponse = await fetch(
      `/api/upload?key=${encodeURIComponent(fullKey)}`
    );
    if (uploadResponse.ok) {
      const { url } = await uploadResponse.json();

      // Upload file using presigned URL
      const putResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (putResponse.ok) {
        // Refresh the folder contents
        if (folderContents.has(folderPath)) {
          setFolderContents((prev) => {
            const newMap = new Map(prev);
            newMap.delete(folderPath);
            return newMap;
          });
          await fetchFolderContents(folderPath);
        }

        // Refresh current directory if uploading to current path
        if (folderPath === currentPath) {
          await fetchObjects(currentPath);
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
    // Fetch the file directly from our API
    const response = await fetch(
      `/api/download?key=${encodeURIComponent(fileKey)}`
    );

    if (response.ok) {
      // Get the file as a blob
      const blob = await response.blob();

      // Create object URL and trigger download
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileKey.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleFileDelete = async (fileKey: string) => {
    if (
      !confirm(`Are you sure you want to delete "${fileKey.split("/").pop()}"?`)
    ) {
      return;
    }

    setDeletingFiles((prev) => new Set(prev).add(fileKey));

    try {
      const response = await fetch(
        `/api/delete?key=${encodeURIComponent(fileKey)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Refresh the current directory
        await fetchObjects(currentPath);

        // Also refresh any folder contents that might contain this file
        const folderPath = fileKey.substring(0, fileKey.lastIndexOf("/") + 1);
        if (folderContents.has(folderPath)) {
          setFolderContents((prev) => {
            const newMap = new Map(prev);
            newMap.delete(folderPath);
            return newMap;
          });
          await fetchFolderContents(folderPath);
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to delete file: ${errorData.error}`);
      }
    } catch (error) {
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
    const folderKey = `${currentPath}${folderName}/`;

    // Create an empty object to represent the folder
    const response = await fetch(
      `/api/upload?key=${encodeURIComponent(folderKey)}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const { url } = await response.json();

      // Upload an empty object to create the folder
      const putResponse = await fetch(url, {
        method: "PUT",
        body: "",
        headers: {
          "Content-Type": "application/x-directory",
        },
      });

      if (putResponse.ok) {
        // Refresh the current directory
        await fetchObjects(currentPath);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">Error: {error}</p>
        <Button onClick={() => fetchObjects(currentPath)} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Enhanced Breadcrumb and Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <BucketInfo bucketInfo={bucketInfo} />
          </div>
          <div className="flex items-center gap-2">
            <CreateFolderButton
              onCreateFolder={() => setIsCreateFolderModalOpen(true)}
              variant="outline"
              className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
            />
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerFileUpload(currentPath);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>

        <StatsBar data={data} uploadingFiles={uploadingFiles} />
      </div>

      {/* Enhanced File and Folder List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <FileListHeader />

        {/* Content */}
        <div className="divide-y">
          {/* Folders */}
          {data.folders &&
            data.folders.map((folder) => (
              <FolderItem
                key={folder}
                folder={folder}
                currentPath={currentPath}
                isExpanded={expandedFolders.has(folder)}
                isLoading={loadingFolders.has(folder)}
                contents={folderContents.get(folder)}
                onToggle={toggleFolder}
                onUpload={triggerFileUpload}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
                getFolderDisplaySize={getFolderDisplaySize}
                deletingFiles={deletingFiles}
              />
            ))}

          {/* Main Files */}
          {data.files &&
            data.files
              .filter((file) => file.Size > 0)
              .map((file) => (
                <FileItem
                  key={file.Key}
                  file={file}
                  currentPath={currentPath}
                  onDownload={handleFileDownload}
                  onDelete={handleFileDelete}
                  isDeleting={deletingFiles.has(file.Key)}
                />
              ))}

          <UploadProgress uploadingFiles={uploadingFiles} />

          <EmptyState
            data={data}
            uploadingFiles={uploadingFiles}
            onUpload={() => triggerFileUpload(currentPath)}
          />
        </div>
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
        currentPath={currentPath || "root directory"}
      />
    </div>
  );
}
