import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, X } from "lucide-react";
import { useEscapeKey } from "@/hooks/use-escape-key";

interface ConfirmDeleteModalProps {
  fileKey: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  fileKey,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  useEscapeKey(fileKey !== null, onCancel);

  if (!fileKey) return null;

  const fileName = fileKey.split("/").pop() || fileKey;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-background/80 backdrop-blur-sm">
      <Card className="relative z-20 w-full max-w-md shadow-2xl border bg-background/95 backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Trash2 className="w-5 h-5 text-destructive" />
              Delete file
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-muted-foreground break-all">
            <span className="font-medium text-foreground">{fileName}</span> will
            be removed from your bucket. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              autoFocus
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
