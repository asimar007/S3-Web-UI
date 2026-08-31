import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  uploadingFiles: Set<string>;
}

export default function UploadProgress({
  uploadingFiles,
}: UploadProgressProps) {
  if (uploadingFiles.size === 0) return null;

  return (
    <>
      {Array.from(uploadingFiles).map((uploadingFile) => (
        <div
          key={uploadingFile}
          className="px-3 sm:px-6 py-3 sm:py-4 bg-muted/30"
        >
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="col-span-6 sm:col-span-4 flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {uploadingFile.split("/").pop()}
                </span>
                <span className="text-xs text-muted-foreground">
                  Uploading…
                </span>
              </div>
            </div>
            <div className="hidden sm:block sm:col-span-2">
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                Sending
              </span>
            </div>
            <div className="hidden sm:block sm:col-span-3">
              <span className="text-sm text-muted-foreground">—</span>
            </div>
            <div className="col-span-6 sm:col-span-3" />
          </div>
        </div>
      ))}
    </>
  );
}
