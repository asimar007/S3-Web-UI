import { Folder, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import UploadButton from "./UploadButton";
import FileItem from "./FileItem";
import { S3Response } from "./types";
import { cleanFolderName } from "./utils";

interface FolderItemProps {
  folder: string;
  prefix?: string;
  nested?: boolean;
  expandedFolders: Set<string>;
  folderContents: Map<string, S3Response>;
  loadingFolders: Set<string>;
  deletingFiles: Set<string>;
  downloadingFiles: Set<string>;
  onToggle: (folderPath: string) => void;
  onUpload: (folderPath: string) => void;
  onDownload: (fileKey: string) => void;
  onDelete: (fileKey: string) => void;
  getFolderDisplaySize: (folderPath: string) => string;
}

export default function FolderItem({
  folder,
  prefix = "",
  nested = false,
  expandedFolders,
  folderContents,
  loadingFolders,
  deletingFiles,
  downloadingFiles,
  onToggle,
  onUpload,
  onDownload,
  onDelete,
  getFolderDisplaySize,
}: FolderItemProps) {
  const folderName = cleanFolderName(folder, prefix);
  const isExpanded = expandedFolders.has(folder);
  const isLoading = loadingFolders.has(folder);
  const contents = folderContents.get(folder);

  return (
    <Collapsible open={isExpanded} onOpenChange={() => onToggle(folder)}>
      <CollapsibleTrigger asChild>
        <div
          className={cn(
            "cursor-pointer transition-all duration-200 w-full",
            nested
              ? "px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted/30 border-b border-border ml-2 sm:ml-4"
              : "px-3 sm:px-6 py-3 sm:py-4 hover:bg-muted/50",
          )}
        >
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="col-span-6 sm:col-span-4 flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-primary" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-primary" />
                )}
              </div>
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg bg-primary shadow-sm flex-shrink-0",
                  nested ? "w-5 h-5 sm:w-6 sm:h-6" : "w-6 h-6 sm:w-8 sm:h-8",
                )}
              >
                <Folder
                  className={cn(
                    "text-primary-foreground",
                    nested ? "h-3 w-3" : "h-3 w-3 sm:h-4 sm:w-4",
                  )}
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className={cn(
                    "text-xs sm:text-sm text-foreground truncate",
                    nested ? "font-medium" : "font-semibold",
                  )}
                >
                  {folderName}
                </span>
                <span className="text-xs text-muted-foreground sm:hidden">
                  {getFolderDisplaySize(folder)}
                </span>
                <span className="hidden sm:block text-xs text-muted-foreground">
                  {nested ? "Subfolder" : "Folder"}
                </span>
              </div>
              {isLoading && (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary flex-shrink-0" />
              )}
            </div>
            <div className="hidden sm:block sm:col-span-2">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  nested
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {getFolderDisplaySize(folder)}
              </span>
            </div>
            <div className="hidden sm:block sm:col-span-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground">
                {nested ? "Nested" : "Directory"}
              </span>
            </div>
            <div className="col-span-6 sm:col-span-3 flex justify-end">
              <UploadButton
                onUpload={(e) => {
                  e?.stopPropagation();
                  onUpload(folder);
                }}
                size="sm"
                className="hover:bg-muted hover:text-foreground transition-colors text-xs sm:text-sm px-2 sm:px-3"
              />
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {contents && (
          <div className="ml-8 border-l-2 border-border">
            {contents.folders.map((child) => (
              <FolderItem
                key={child}
                folder={child}
                prefix={folder}
                nested
                expandedFolders={expandedFolders}
                folderContents={folderContents}
                loadingFolders={loadingFolders}
                deletingFiles={deletingFiles}
                downloadingFiles={downloadingFiles}
                onToggle={onToggle}
                onUpload={onUpload}
                onDownload={onDownload}
                onDelete={onDelete}
                getFolderDisplaySize={getFolderDisplaySize}
              />
            ))}
            {contents.files
              .filter((file) => file.Size > 0)
              .map((file) => (
                <FileItem
                  key={file.Key}
                  file={file}
                  prefix={folder}
                  nested
                  onDownload={onDownload}
                  onDelete={onDelete}
                  isDeleting={deletingFiles.has(file.Key)}
                  isDownloading={downloadingFiles.has(file.Key)}
                />
              ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
