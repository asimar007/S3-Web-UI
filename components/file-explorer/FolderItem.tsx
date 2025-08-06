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
        <div className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 w-full border-l-4 border-transparent hover:border-blue-400">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-blue-600" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-blue-600" />
                )}
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                <Folder className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {folderName}
                </span>
                <span className="text-xs text-gray-500">Folder</span>
              </div>
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-500"></div>
              )}
            </div>
            <div className="col-span-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {getFolderDisplaySize(folder)}
              </span>
            </div>
            <div className="col-span-3 text-sm text-gray-500">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-600">
                Directory
              </span>
            </div>
            <div className="col-span-3">
              <UploadButton
                onUpload={(e) => {
                  e?.stopPropagation();
                  onUpload(folder);
                }}
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
              />
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {contents && (
          <div className="ml-8 border-l-2 border-gray-200">
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
