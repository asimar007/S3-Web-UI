import { File } from "lucide-react";

export default function FileListHeader() {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
      <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
        <div className="col-span-4 flex items-center gap-2">
          <File className="h-4 w-4 text-gray-500" />
          Name
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-100 flex items-center justify-center">
            <span className="text-xs text-blue-600 font-bold">S</span>
          </div>
          Size
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-100 flex items-center justify-center">
            <span className="text-xs text-green-600 font-bold">T</span>
          </div>
          Last Modified
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-purple-100 flex items-center justify-center">
            <span className="text-xs text-purple-600 font-bold">A</span>
          </div>
          Actions
        </div>
      </div>
    </div>
  );
}
