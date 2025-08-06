import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onUpload: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  size?: "sm" | "default";
  variant?: "default" | "outline";
  className?: string;
  children?: React.ReactNode;
}

export default function UploadButton({
  onUpload,
  size = "sm",
  variant = "outline",
  className = "",
  children,
}: UploadButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onUpload(e);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <Upload className="h-3 w-3" />
      {children || "Upload"}
    </Button>
  );
}
