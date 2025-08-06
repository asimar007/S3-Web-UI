interface FileIconProps {
  fileName: string;
  size?: "sm" | "md";
}

export default function FileIcon({ fileName, size = "md" }: FileIconProps) {
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

  const getFileIcon = () => {
    if (["jpg", "jpeg", "png", "gif", "webp", "heic"].includes(fileExtension)) {
      return "🖼️";
    } else if (["pdf"].includes(fileExtension)) {
      return "📄";
    } else if (["doc", "docx"].includes(fileExtension)) {
      return "📝";
    } else if (["zip", "rar", "7z"].includes(fileExtension)) {
      return "📦";
    } else if (["mp4", "avi", "mov"].includes(fileExtension)) {
      return "🎥";
    } else if (["mp3", "wav", "flac"].includes(fileExtension)) {
      return "🎵";
    }
    return "📄";
  };

  const sizeClass = size === "sm" ? "text-xs" : "text-sm";

  return <span className={sizeClass}>{getFileIcon()}</span>;
}
