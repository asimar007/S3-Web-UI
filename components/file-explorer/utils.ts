export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || "";
};

export const cleanFolderName = (
  folder: string,
  currentPath: string
): string => {
  return folder.replace(currentPath, "").replace("/", "");
};

export const truncateFileName = (
  fileName: string,
  maxLength: number = 20
): string => {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  // Split filename and extension
  const lastDotIndex = fileName.lastIndexOf(".");
  const name =
    lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";

  // If name is short enough, return as is
  if (name.length <= maxLength - extension.length - 3) {
    // 3 for "..."
    return fileName;
  }

  // Calculate how many characters we can show from start and end
  const availableLength = maxLength - extension.length - 3; // 3 for "..."
  const startLength = Math.ceil(availableLength * 0.6); // 60% for start
  const endLength = Math.floor(availableLength * 0.4); // 40% for end

  const startPart = name.substring(0, startLength);
  const endPart = name.substring(name.length - endLength);

  return `${startPart}...${endPart}${extension}`;
};
