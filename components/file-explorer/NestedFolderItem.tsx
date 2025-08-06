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
      className="px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-200 border-b border-gray-100 ml-4"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(nestedFolder);
      }}
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 shadow-sm">
            <Folder className="h-3 w-3 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {folderName}
            </span>
            <span className="text-xs text-gray-400">Subfolder</span>
          </div>
        </div>
        <div className="col-span-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            {getFolderDisplaySize(nestedFolder)}
          </span>
        </div>
        <div className="col-span-3 text-sm text-gray-500">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-600">
            Nested
          </span>
        </div>
        <div className="col-span-3">
          <UploadButton
            onUpload={(e) => {
              e?.stopPropagation();
              onUpload(nestedFolder);
            }}
            className="hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
