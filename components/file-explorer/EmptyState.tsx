import { Button } from "@/components/ui/button";
import { File, Upload } from "lucide-react";
import { S3Response } from "./types";

interface EmptyStateProps {
  data: S3Response;
  uploadingFiles: Set<string>;
  onUpload: () => void;
}

export default function EmptyState({
  data,
  uploadingFiles,
  onUpload,
}: EmptyStateProps) {
  const isEmpty =
    (!data.files || data.files.filter((file) => file.Size > 0).length === 0) &&
    (!data.folders || data.folders.length === 0) &&
    uploadingFiles.size === 0;

  if (!isEmpty) return null;

  return (
    <div className="px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
          <File className="h-10 w-10 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">
            No files or folders found
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            This directory is empty. Upload some files to get started!
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUpload();
          }}
          className="flex items-center gap-2 mt-4 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload Your First File
        </Button>
      </div>
    </div>
  );
}
