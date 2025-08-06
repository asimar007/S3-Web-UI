import { Folder, File } from "lucide-react";
import { S3Response } from "./types";

interface StatsBarProps {
  data: S3Response;
  uploadingFiles: Set<string>;
}

export default function StatsBar({ data, uploadingFiles }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Folder className="h-4 w-4 text-blue-500" />
        <span className="font-medium">{data.folders?.length || 0} folders</span>
      </div>
      <div className="w-px h-4 bg-gray-300"></div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <File className="h-4 w-4 text-green-500" />
        <span className="font-medium">
          {data.files?.filter((file) => file.Size > 0).length || 0} files
        </span>
      </div>
      {uploadingFiles.size > 0 && (
        <>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
            <span className="font-medium">{uploadingFiles.size} uploading</span>
          </div>
        </>
      )}
    </div>
  );
}
