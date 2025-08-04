"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Folder,
  File,
  ArrowLeft,
  Download,
  ChevronDown,
  ChevronRight,
  Upload,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface S3Object {
  Key: string;
  Size: number;
  LastModified: string;
}

interface S3Response {
  files: S3Object[];
  folders: string[];
}

interface FileExplorerProps {
  initialPrefix?: string;
}

export default function FileExplorer({
  initialPrefix = "",
}: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState(initialPrefix);
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

  const fetchObjects = async (prefix: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/objects${
        prefix ? `?prefix=${encodeURIComponent(prefix)}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch objects");
      const result: S3Response = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects(currentPath);
  }, [currentPath]);

  const fetchFolderContents = async (folderPath: string) => {
    if (folderContents.has(folderPath)) return;

    setLoadingFolders((prev) => new Set(prev).add(folderPath));
    try {
      const url = `/api/objects?prefix=${encodeURIComponent(folderPath)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch folder contents");
      const result: S3Response = await response.json();
      setFolderContents((prev) => new Map(prev).set(folderPath, result));
    } catch (err) {
      console.error("Error fetching folder contents:", err);
    } finally {
      setLoadingFolders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(folderPath);
        return newSet;
      });
    }
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

  const navigateBack = () => {
    if (currentPath) {
      const pathParts = currentPath.split("/").filter(Boolean);
      pathParts.pop();
      setCurrentPath(pathParts.length > 0 ? pathParts.join("/") + "/" : "");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

    try {
      // Get presigned URL
      const uploadResponse = await fetch(
        `/api/upload?key=${encodeURIComponent(fullKey)}`
      );
      if (!uploadResponse.ok) throw new Error("Failed to get presigned URL");

      const { url } = await uploadResponse.json();

      // Upload file using presigned URL
      const putResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!putResponse.ok) throw new Error("Failed to upload file");

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
    } catch (err) {
      console.error("Upload failed:", err);
      alert(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
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
    try {
      // Fetch the file directly from our API
      const response = await fetch(
        `/api/download?key=${encodeURIComponent(fileKey)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download file");
      }

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
    } catch (err) {
      console.error("Download failed:", err);
      alert(
        `Download failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
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
      {/* Breadcrumb and Navigation */}
      <div className="flex items-center justify-between gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {currentPath && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigateBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <span className="text-sm text-gray-600">
            Path: /{currentPath || "root"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => triggerFileUpload(currentPath)}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* File and Folder List */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-4 py-3 border-b">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3">Last Modified</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>

        {/* Content */}
        <div className="divide-y">
          {/* Folders */}
          {data.folders.map((folder) => {
            const isExpanded = expandedFolders.has(folder);
            const isLoading = loadingFolders.has(folder);
            const contents = folderContents.get(folder);
            const folderName = folder.replace(currentPath, "").replace("/", "");

            return (
              <Collapsible
                key={folder}
                open={isExpanded}
                onOpenChange={() => toggleFolder(folder)}
              >
                <CollapsibleTrigger asChild>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors w-full">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <Folder className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">
                          {folderName}
                        </span>
                        {isLoading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        )}
                      </div>
                      <div className="col-span-2 text-sm text-gray-500">
                        {getFolderDisplaySize(folder)}
                      </div>
                      <div className="col-span-3 text-sm text-gray-500">—</div>
                      <div className="col-span-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFileUpload(folder);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {contents && (
                    <div className="ml-8 border-l-2 border-gray-200">
                      {/* Nested folders */}
                      {contents.folders.map((nestedFolder) => (
                        <div
                          key={nestedFolder}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolder(nestedFolder);
                          }}
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-5 flex items-center gap-2">
                              <Folder className="h-4 w-4 text-blue-400" />
                              <span className="text-sm">
                                {nestedFolder
                                  .replace(folder, "")
                                  .replace("/", "")}
                              </span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-500">
                              {getFolderDisplaySize(nestedFolder)}
                            </div>
                            <div className="col-span-3 text-sm text-gray-500">
                              —
                            </div>
                            <div className="col-span-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerFileUpload(nestedFolder);
                                }}
                                className="flex items-center gap-1"
                              >
                                <Upload className="h-3 w-3" />
                                Upload
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Nested files */}
                      {contents.files
                        .filter((file) => file.Size > 0)
                        .map((file) => (
                          <div
                            key={file.Key}
                            className="px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          >
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-5 flex items-center gap-2">
                                <File className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">
                                  {file.Key.replace(folder, "")}
                                </span>
                              </div>
                              <div className="col-span-2 text-sm text-gray-600">
                                {formatFileSize(file.Size)}
                              </div>
                              <div className="col-span-3 text-sm text-gray-600">
                                {formatDate(file.LastModified)}
                              </div>
                              <div className="col-span-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleFileDownload(file.Key)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {/* Files */}
          {data.files
            .filter((file) => file.Size > 0)
            .map((file) => (
              <div
                key={file.Key}
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 flex items-center gap-2">
                    <File className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">
                      {file.Key.replace(currentPath, "")}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {formatFileSize(file.Size)}
                  </div>
                  <div className="col-span-3 text-sm text-gray-600">
                    {formatDate(file.LastModified)}
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileDownload(file.Key)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

          {/* Uploading files indicator */}
          {Array.from(uploadingFiles).map((uploadingFile) => (
            <div
              key={uploadingFile}
              className="px-4 py-3 bg-blue-50 border-l-4 border-blue-400"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <File className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-blue-700">
                    Uploading: {uploadingFile.split("/").pop()}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-blue-600">
                  Uploading...
                </div>
                <div className="col-span-3 text-sm text-blue-600">
                  In progress
                </div>
                <div className="col-span-2"></div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {data.files.filter((file) => file.Size > 0).length === 0 &&
            data.folders.length === 0 &&
            uploadingFiles.size === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <File className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No files or folders found</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
