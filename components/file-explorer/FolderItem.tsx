import { Folder, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import UploadButton from "./UploadButton";
import NestedFolderItem from "./NestedFolderItem";
import NestedFileItem from "./NestedFileItem";
import { S3Response } from "./types";
import { cleanFolderName } from "./utils";

interface FolderItemProps {
  folder: string;
  currentPath: string;
  isExpanded: boolean;
  isLoading: boolean;
  contents: S3Response | undefined;
  onToggle: (folderPath: string) => void;
  onUpload: (folderPath: string) => void;
  onDownload: (fileKey: string) => void;
  onDelete: (fileKey: string) => void;
  getFolderDisplaySize: (folderPath: string) => string;
  deletingFiles: Set<string>;
}

export default function FolderItem({
  folder,
  currentPath,
  isExpanded,
  isLoading,
  contents,
  onToggle,
  onUpload,
  onDownload,
  onDelete,
  getFolderDisplaySize,
  deletingFiles,
}: FolderItemProps) {
  const folderName = cleanFolderName(folder, currentPath);

  return (
    <Collapsible open={isExpanded} onOpenChange={() => onToggle(folder)}>
      <CollapsibleTrigger asChild>
        <div className="px-3 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 cursor-pointer transition-all duration-200 w-full border-l-4 border-transparent hover:border-primary">
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="col-span-6 sm:col-span-4 flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-primary" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-primary" />
                )}
              </div>
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary shadow-sm flex-shrink-0">
                <Folder className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {folderName}
                </span>
                <span className="text-xs text-muted-foreground sm:hidden">
                  {getFolderDisplaySize(folder)}
                </span>
                <span className="hidden sm:block text-xs text-muted-foreground">
                  Folder
                </span>
              </div>
              {isLoading && (
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-muted border-t-primary flex-shrink-0"></div>
              )}
            </div>
            <div className="hidden sm:block sm:col-span-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {getFolderDisplaySize(folder)}
              </span>
            </div>
            <div className="hidden sm:block sm:col-span-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground">
                Directory
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
            {/* Nested folders */}
            {contents.folders.map((nestedFolder) => (
              <NestedFolderItem
                key={nestedFolder}
                nestedFolder={nestedFolder}
                folder={folder}
                onToggle={onToggle}
                onUpload={onUpload}
                getFolderDisplaySize={getFolderDisplaySize}
              />
            ))}
            {/* Nested files */}
            {contents.files
              .filter((file) => file.Size > 0)
              .map((file) => (
                <NestedFileItem
                  key={file.Key}
                  file={file}
                  folder={folder}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  isDeleting={deletingFiles.has(file.Key)}
                />
              ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
