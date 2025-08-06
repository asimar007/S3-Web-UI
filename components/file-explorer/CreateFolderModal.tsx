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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Amber Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)`,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      <Card className="relative z-20 w-full max-w-md shadow-2xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              Create New Folder
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Create a new folder in {currentPath || "root directory"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
                required
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
