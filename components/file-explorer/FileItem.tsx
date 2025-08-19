import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import FileIcon from "./FileIcon";
import { S3Object } from "./types";
import {
  formatFileSize,
  formatDate,
  getFileExtension,
  truncateFileName,
} from "./utils";

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
    <div className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 transition-all duration-200 border-l-4 border-transparent hover:border-primary">
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
        <div className="col-span-6 sm:col-span-4 flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
            <FileIcon fileName={fileName} size="sm" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="text-xs sm:text-sm font-semibold text-foreground"
              title={fileName} // Show full filename on hover
            >
              {truncateFileName(fileName, 25)}
            </span>
            <span className="text-xs text-muted-foreground uppercase font-medium sm:hidden">
              {formatFileSize(file.Size)}
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground uppercase font-medium">
              {fileExtension || "file"}
            </span>
          </div>
        </div>
        <div className="hidden sm:block sm:col-span-2">
          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
            {formatFileSize(file.Size)}
          </span>
        </div>
        <div className="hidden sm:block sm:col-span-3">
          <span className="text-sm text-muted-foreground">
            {formatDate(file.LastModified)}
          </span>
        </div>
        <div className="col-span-6 sm:col-span-3 flex items-center gap-1 sm:gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(file.Key)}
            className="flex items-center gap-1 sm:gap-2 hover:bg-muted hover:text-foreground transition-colors shadow-sm text-xs sm:text-sm px-2 sm:px-3"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(file.Key)}
            disabled={isDeleting}
            className="flex items-center justify-center hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-colors shadow-sm px-2 sm:px-3"
            title={isDeleting ? "Deleting..." : "Delete file"}
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-destructive"></div>
            ) : (
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
