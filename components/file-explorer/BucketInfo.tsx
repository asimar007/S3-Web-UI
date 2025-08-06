import { BucketInfoType } from "./types";

interface BucketInfoProps {
  bucketInfo: BucketInfoType | null;
}

export default function BucketInfo({ bucketInfo }: BucketInfoProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-400">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
        <span className="text-white text-sm">📦</span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-emerald-800 text-sm">
          {bucketInfo ? bucketInfo.bucketName : "Loading..."}
        </span>
        <span className="text-xs text-emerald-600 font-medium">
          {bucketInfo ? bucketInfo.awsRegion : "---"}
        </span>
      </div>
    </div>
  );
}
