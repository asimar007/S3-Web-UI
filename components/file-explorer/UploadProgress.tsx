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
          className="px-6 py-4 bg-muted/30 border-l-4 border-primary animate-pulse"
        >
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5 flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {uploadingFile.split("/").pop()}
                </span>
                <span className="text-xs text-primary">Uploading...</span>
              </div>
            </div>
            <div className="col-span-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary animate-pulse">
                Processing...
              </span>
            </div>
            <div className="col-span-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                📤 In Progress
              </span>
            </div>
            <div className="col-span-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
