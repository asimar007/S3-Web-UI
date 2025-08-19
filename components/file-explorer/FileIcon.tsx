import {
  Image,
  FileText,
  File,
  Archive,
  Video,
  Music,
  FileSpreadsheet,
  FileCode2,
  Text,
} from "lucide-react";

interface FileIconProps {
  fileName: string;
  size?: "sm" | "md";
}

export default function FileIcon({ fileName, size = "md" }: FileIconProps) {
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  const getFileIconWithColor = () => {
    // Images - Blue
    if (
      [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "heic",
        "svg",
        "bmp",
        "tiff",
      ].includes(fileExtension)
    ) {
      return <Image className={`text-blue-400 ${sizeClass}`} />;
    }
    // PDFs - Red
    else if (["pdf"].includes(fileExtension)) {
      return <Text className={`text-red-400 ${sizeClass}`} />;
    }
    // Documents - Blue
    else if (["doc", "docx", "txt", "rtf", "odt"].includes(fileExtension)) {
      return <FileText className={`text-blue-300 ${sizeClass}`} />;
    }
    // Spreadsheets - Green
    else if (["xls", "xlsx", "csv", "ods"].includes(fileExtension)) {
      return <FileSpreadsheet className={`text-green-400 ${sizeClass}`} />;
    }
    // Archives - Yellow
    else if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(fileExtension)) {
      return <Archive className={`text-yellow-400 ${sizeClass}`} />;
    }
    // Videos - Purple
    else if (
      ["mp4", "avi", "mov", "mkv", "wmv", "flv", "webm", "m4v"].includes(
        fileExtension
      )
    ) {
      return <Video className={`text-purple-400 ${sizeClass}`} />;
    }
    // Audio - Green
    else if (
      ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"].includes(fileExtension)
    ) {
      return <Music className={`text-green-300 ${sizeClass}`} />;
    }
    // Code files - Orange
    else if (
      [
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "scss",
        "json",
        "xml",
        "yaml",
        "yml",
        "py",
        "java",
        "cpp",
        "c",
        "php",
        "rb",
        "go",
        "rs",
        "swift",
      ].includes(fileExtension)
    ) {
      return <FileCode2 className={`text-orange-400 ${sizeClass}`} />;
    }
    // Default - Gray
    return <File className={`text-gray-400 ${sizeClass}`} />;
  };

  return getFileIconWithColor();
}
