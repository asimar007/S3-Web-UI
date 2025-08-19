import { Folder, File } from "lucide-react";
import { S3Response } from "./types";

interface StatsBarProps {
  data: S3Response;
  uploadingFiles: Set<string>;
}

export default function StatsBar({ data, uploadingFiles }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Folder className="h-4 w-4 text-primary" />
        <span className="font-medium">{data.folders?.length || 0} folders</span>
      </div>
      <div className="w-px h-4 bg-border"></div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <File className="h-4 w-4 text-primary" />
        <span className="font-medium">
          {data.files?.filter((file) => file.Size > 0).length || 0} files
        </span>
      </div>
      {uploadingFiles.size > 0 && (
        <>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2 text-sm text-primary">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
            <span className="font-medium">{uploadingFiles.size} uploading</span>
          </div>
        </>
      )}
    </div>
  );
}
