export interface S3Object {
  Key: string;
  Size: number;
  LastModified: string;
}

export interface S3Response {
  files: S3Object[];
  folders: string[];
}

export interface BucketInfoType {
  bucketName: string;
  awsRegion: string;
}
