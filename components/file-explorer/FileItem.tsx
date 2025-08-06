import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import FileIcon from "./FileIcon";
import { S3Object } from "./types";
import { formatFileSize, formatDate, getFileExtension } from "./utils";

interface FileItemProps {
  file: S3Object;
  currentPath: string;
  onDownload: (fileKey: string) => void;
  onDelete: (fileKey: string) => void;
  isDeleting: boolean;
}

export default function FileItem({
  file,
  currentPath,
  onDownload,
  onDelete,
  isDeleting,
}: FileItemProps) {
  const fileName = file.Key.replace(currentPath, "");
  const fileExtension = getFileExtension(fileName);

  return (
    <div className="px-6 py-4 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-200 border-l-4 border-transparent hover:border-green-400">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 shadow-sm">
            <FileIcon fileName={fileName} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 truncate max-w-64">
              {fileName}
            </span>
            <span className="text-xs text-gray-500 uppercase font-medium">
              {fileExtension || "file"}
            </span>
          </div>
        </div>
        <div className="col-span-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            {formatFileSize(file.Size)}
          </span>
        </div>
        <div className="col-span-3">
          <span className="text-sm text-gray-600">
            {formatDate(file.LastModified)}
          </span>
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(file.Key)}
            className="flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(file.Key)}
            disabled={isDeleting}
            className="flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors shadow-sm"
            title={isDeleting ? "Deleting..." : "Delete file"}
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
