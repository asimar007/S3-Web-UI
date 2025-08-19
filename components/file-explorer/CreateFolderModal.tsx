import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderPlus, X } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
  currentPath: string;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  onCreateFolder,
  currentPath,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    if (folderName.includes("/") || folderName.includes("\\")) {
      setError("Folder name cannot contain slashes");
      return;
    }

    if (folderName.trim().length > 50) {
      setError("Folder name must be less than 50 characters");
      return;
    }

    onCreateFolder(folderName.trim());
    setFolderName("");
    onClose();
  };

  const handleClose = () => {
    setFolderName("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-background/80 backdrop-blur-sm">
      <Card className="relative z-20 w-full max-w-md shadow-2xl border bg-background/95 backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FolderPlus className="w-5 h-5 text-primary" />
              Create New Folder
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-muted-foreground">
            Create a new folder in {currentPath || "root directory"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="folderName"
                className="text-foreground font-medium"
              >
                Folder Name
              </Label>
              <Input
                id="folderName"
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
                required
                className="bg-background border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Folder
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
