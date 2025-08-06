import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

interface CreateFolderButtonProps {
  onCreateFolder: () => void;
  size?: "sm" | "default";
  variant?: "default" | "outline";
  className?: string;
}

export default function CreateFolderButton({
  onCreateFolder,
  size = "sm",
  variant = "outline",
  className = "",
}: CreateFolderButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onCreateFolder();
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <FolderPlus className="h-4 w-4" />
      Create Folder
    </Button>
  );
}
