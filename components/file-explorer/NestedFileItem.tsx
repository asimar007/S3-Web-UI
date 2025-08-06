import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import FileIcon from "./FileIcon";
import { S3Object } from "./types";
import { formatFileSize, formatDate, getFileExtension } from "./utils";

interface NestedFileItemProps {
  file: S3Object;
  folder: string;
  onDownload: (fileKey: string) => void;
  onDelete: (fileKey: string) => void;
  isDeleting: boolean;
}

export default function NestedFileItem({
  file,
  folder,
  onDownload,
  onDelete,
  isDeleting,
}: NestedFileItemProps) {
  const fileName = file.Key.replace(folder, "");
  const fileExtension = getFileExtension(fileName);

  return (
    <div className="px-4 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 border-b border-gray-100 ml-8">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm">
            <FileIcon fileName={fileName} size="sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 truncate max-w-48">
              {fileName}
            </span>
            <span className="text-xs text-gray-400 uppercase">
              {fileExtension || "file"}
            </span>
          </div>
        </div>
        <div className="col-span-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {formatFileSize(file.Size)}
          </span>
        </div>
        <div className="col-span-3">
          <span className="text-xs text-gray-500">
            {formatDate(file.LastModified)}
          </span>
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(file.Key)}
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(file.Key)}
            disabled={isDeleting}
            className="flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
            title={isDeleting ? "Deleting..." : "Delete file"}
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
