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
          className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 animate-pulse"
        >
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5 flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-blue-800">
                  {uploadingFile.split("/").pop()}
                </span>
                <span className="text-xs text-blue-600">Uploading...</span>
              </div>
            </div>
            <div className="col-span-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 animate-pulse">
                Processing...
              </span>
            </div>
            <div className="col-span-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                📤 In Progress
              </span>
            </div>
            <div className="col-span-2">
              <div className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
