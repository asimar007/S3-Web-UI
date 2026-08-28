import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  prefix?: string;
  nested?: boolean;
  onDownload: (fileKey: string) => void;
  onDelete: (fileKey: string) => void;
  isDeleting: boolean;
}

export default function FileItem({
  file,
  prefix = "",
  nested = false,
  onDownload,
  onDelete,
  isDeleting,
}: FileItemProps) {
  const fileName = prefix ? file.Key.replace(prefix, "") : file.Key;
  const fileExtension = getFileExtension(fileName);

  return (
    <div
      className={cn(
        "transition-all duration-200",
        nested
          ? "px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted/30 border-b border-border ml-4 sm:ml-8"
          : "px-3 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 border-l-4 border-transparent hover:border-primary",
      )}
    >
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
        <div className="col-span-6 sm:col-span-4 flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className={cn(
              "flex items-center justify-center flex-shrink-0",
              nested ? "w-5 h-5 sm:w-6 sm:h-6" : "w-6 h-6 sm:w-8 sm:h-8",
            )}
          >
            <FileIcon fileName={fileName} size="sm" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className={cn(
                "text-xs sm:text-sm text-foreground",
                nested ? "font-medium truncate" : "font-semibold",
              )}
              title={fileName}
            >
              {truncateFileName(fileName, nested ? 18 : 25)}
            </span>
            <span
              className={cn(
                "text-xs text-muted-foreground sm:hidden",
                !nested && "uppercase font-medium",
              )}
            >
              {formatFileSize(file.Size)}
            </span>
            <span
              className={cn(
                "hidden sm:block text-xs text-muted-foreground uppercase",
                !nested && "font-medium",
              )}
            >
              {fileExtension || "file"}
            </span>
          </div>
        </div>
        <div className="hidden sm:block sm:col-span-2">
          <span
            className={cn(
              "inline-flex items-center py-1 rounded-full text-xs bg-primary/20 text-primary",
              nested ? "px-2 font-medium" : "px-2 sm:px-3 font-semibold",
            )}
          >
            {formatFileSize(file.Size)}
          </span>
        </div>
        <div className="hidden sm:block sm:col-span-3">
          <span
            className={cn(
              "text-muted-foreground",
              nested ? "text-xs" : "text-sm",
            )}
          >
            {formatDate(file.LastModified)}
          </span>
        </div>
        <div className="col-span-6 sm:col-span-3 flex items-center gap-1 sm:gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(file.Key)}
            className={cn(
              "flex items-center gap-1 sm:gap-2 hover:bg-muted hover:text-foreground transition-colors text-xs sm:text-sm px-2 sm:px-3",
              !nested && "shadow-sm",
            )}
          >
            <Download className={nested ? "h-3 w-3" : "h-3 w-3 sm:h-4 sm:w-4"} />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(file.Key)}
            disabled={isDeleting}
            className={cn(
              "flex items-center justify-center hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-colors px-2 sm:px-3",
              !nested && "shadow-sm",
            )}
            title={isDeleting ? "Deleting..." : "Delete file"}
          >
            {isDeleting ? (
              <div
                className={cn(
                  "animate-spin rounded-full border-b-2 border-destructive",
                  nested ? "h-3 w-3" : "h-3 w-3 sm:h-4 sm:w-4",
                )}
              />
            ) : (
              <Trash2 className={nested ? "h-3 w-3" : "h-3 w-3 sm:h-4 sm:w-4"} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
