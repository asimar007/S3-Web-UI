import { BucketInfoType } from "./types";
import { Database, MapPin } from "lucide-react";

interface BucketInfoProps {
  bucketInfo: BucketInfoType | null;
}

export default function BucketInfo({ bucketInfo }: BucketInfoProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-muted/50 rounded-xl border border-border hover:bg-muted/70 transition-colors duration-200 min-w-0 flex-1 sm:flex-initial">
      {/* Icon Container with gradient */}
      <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md flex-shrink-0">
        <Database className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold text-foreground text-xs sm:text-sm truncate">
            {bucketInfo ? bucketInfo.bucketName : "Loading..."}
          </span>
          {bucketInfo && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-md">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-medium">
                {bucketInfo.awsRegion}
              </span>
            </div>
          )}
        </div>

        {/* Loading skeleton or status */}
        {!bucketInfo ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-16 sm:w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-2 w-8 sm:w-12 bg-muted animate-pulse rounded"></div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              AWS S3 Bucket
            </span>
            {/* Show region on mobile in a different way */}
            <div className="sm:hidden flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 rounded text-xs text-primary font-medium">
              {bucketInfo.awsRegion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
