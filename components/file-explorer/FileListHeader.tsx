import { File } from "lucide-react";

export default function FileListHeader() {
  return (
    <div className="bg-muted/50 px-3 sm:px-6 py-3 sm:py-4 border-b border-border">
      <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-foreground">
        <div className="col-span-6 sm:col-span-4 flex items-center gap-1 sm:gap-2">
          <File className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          Name
        </div>
        <div className="col-span-2 sm:col-span-2 flex items-center gap-1 sm:gap-2">
          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-primary/20 flex items-center justify-center">
            <span className="text-xs text-primary font-bold">S</span>
          </div>
          <span className="hidden sm:inline">Size</span>
        </div>
        <div className="hidden sm:flex sm:col-span-3 items-center gap-2">
          <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center">
            <span className="text-xs text-primary font-bold">T</span>
          </div>
          Last Modified
        </div>
        <div className="col-span-4 sm:col-span-3 flex items-center gap-1 sm:gap-2">
          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-primary/20 flex items-center justify-center">
            <span className="text-xs text-primary font-bold">A</span>
          </div>
          Actions
        </div>
      </div>
    </div>
  );
}
