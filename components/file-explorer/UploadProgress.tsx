import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  uploadingFiles: Set<string>;
  /** Listing this row belongs to; "" is the bucket root. */
  prefix?: string;
  nested?: boolean;
}

export default function UploadProgress({
  uploadingFiles,
  prefix = "",
  nested = false,
}: UploadProgressProps) {
  // Only direct children: a key uploading into a subfolder belongs to that
  // folder's listing, not to this one.
  const inScope = Array.from(uploadingFiles).filter(
    (key) => key.startsWith(prefix) && !key.slice(prefix.length).includes("/"),
  );

  if (inScope.length === 0) return null;

  return (
    <>
      {inScope.map((key) => (
        <div
          key={key}
          className={cn(
            "bg-muted/30",
            nested
              ? "px-3 sm:px-4 py-2 sm:py-3 border-b border-border ml-4 sm:ml-8"
              : "px-3 sm:px-6 py-3 sm:py-4",
          )}
        >
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="col-span-6 sm:col-span-4 flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className={cn(
                  "flex items-center justify-center flex-shrink-0",
                  nested ? "w-5 h-5 sm:w-6 sm:h-6" : "w-6 h-6 sm:w-8 sm:h-8",
                )}
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {key.slice(prefix.length)}
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
