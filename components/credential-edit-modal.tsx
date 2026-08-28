"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CredentialSetup from "@/components/credential-setup";

interface CredentialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateComplete: () => void;
}

export default function CredentialEditModal({
  isOpen,
  onClose,
  onUpdateComplete,
}: CredentialEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative z-20 w-full max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </Button>
        <CredentialSetup onSetupComplete={onUpdateComplete} />
      </div>
    </div>
  );
}
