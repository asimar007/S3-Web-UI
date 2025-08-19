import { Folder } from "lucide-react";
import UploadButton from "./UploadButton";
import { cleanFolderName } from "./utils";

interface NestedFolderItemProps {
  nestedFolder: string;
  folder: string;
  onToggle: (folderPath: string) => void;
  onUpload: (folderPath: string) => void;
  getFolderDisplaySize: (folderPath: string) => string;
}

export default function NestedFolderItem({
  nestedFolder,
  folder,
  onToggle,
  onUpload,
  getFolderDisplaySize,
}: NestedFolderItemProps) {
  const folderName = cleanFolderName(nestedFolder, folder);

  return (
    <div
      className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted/30 cursor-pointer transition-all duration-200 border-b border-border ml-2 sm:ml-4"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(nestedFolder);
      }}
    >
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
        <div className="col-span-6 sm:col-span-4 flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-primary shadow-sm flex-shrink-0">
            <Folder className="h-3 w-3 text-primary-foreground" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-medium text-foreground truncate">
              {folderName}
            </span>
            <span className="text-xs text-muted-foreground sm:hidden">
              {getFolderDisplaySize(nestedFolder)}
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground">
              Subfolder
            </span>
          </div>
        </div>
        <div className="hidden sm:block sm:col-span-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
            {getFolderDisplaySize(nestedFolder)}
          </span>
        </div>
        <div className="hidden sm:block sm:col-span-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground">
            Nested
          </span>
        </div>
        <div className="col-span-6 sm:col-span-3 flex justify-end">
          <UploadButton
            onUpload={(e) => {
              e?.stopPropagation();
              onUpload(nestedFolder);
            }}
            size="sm"
            className="hover:bg-muted hover:text-foreground transition-colors text-xs sm:text-sm px-2 sm:px-3"
          />
        </div>
      </div>
    </div>
  );
}
