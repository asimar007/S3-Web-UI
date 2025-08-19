"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Key, Globe, Folder, X } from "lucide-react";

interface CredentialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateComplete: () => void;
}

interface CredentialData {
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  bucketName: string;
}

export default function CredentialEditModal({
  isOpen,
  onClose,
  onUpdateComplete,
}: CredentialEditModalProps) {
  const [formData, setFormData] = useState<CredentialData>({
    awsAccessKeyId: "",
    awsSecretAccessKey: "",
    awsRegion: "",
    bucketName: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch current credentials when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCurrentCredentials();
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const fetchCurrentCredentials = async () => {
    setFetchLoading(true);
    const response = await fetch("/api/user/credentials");
    if (response.ok) {
      const credentials = await response.json();
      setFormData({
        awsAccessKeyId: credentials.awsAccessKeyId,
        awsSecretAccessKey: credentials.awsSecretAccessKey,
        awsRegion: credentials.awsRegion,
        bucketName: credentials.bucketName,
      });
    }
    setFetchLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/user/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        email: "existing",
      }),
    });

    if (response.ok) {
      setSuccess(true);
      setTimeout(() => {
        onUpdateComplete();
        onClose();
      }, 1500);
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Update failed");
    }
    setLoading(false);
  };

  const handleInputChange = (field: keyof CredentialData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-background/80 backdrop-blur-sm">
      <Card className="relative z-20 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border bg-background/95 backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Key className="w-5 h-5 text-primary" />
              Edit AWS Credentials
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-muted-foreground">
            Update your AWS credentials and S3 bucket configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fetchLoading ? (
            <div className="flex items-center justify-center py-8 text-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Loading current credentials...</span>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Updated Successfully!
              </h3>
              <p className="text-muted-foreground">
                Your AWS credentials have been updated.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="accessKey"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <Key className="w-4 h-4 text-primary" />
                  AWS Access Key ID
                </Label>
                <Input
                  id="accessKey"
                  type="text"
                  placeholder="Enter Your AWS Access Key ID"
                  value={formData.awsAccessKeyId}
                  onChange={(e) =>
                    handleInputChange("awsAccessKeyId", e.target.value)
                  }
                  required
                  className="bg-background border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="secretKey"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <Key className="w-4 h-4 text-primary" />
                  AWS Secret Access Key
                </Label>
                <Input
                  id="secretKey"
                  type="password"
                  placeholder="Enter your secret key"
                  value={formData.awsSecretAccessKey}
                  onChange={(e) =>
                    handleInputChange("awsSecretAccessKey", e.target.value)
                  }
                  required
                  className="bg-background border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="region"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  AWS Region
                </Label>
                <Input
                  id="region"
                  type="text"
                  placeholder="ap-south-1"
                  value={formData.awsRegion}
                  onChange={(e) =>
                    handleInputChange("awsRegion", e.target.value)
                  }
                  required
                  className="bg-background border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bucket"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <Folder className="w-4 h-4 text-primary" />
                  S3 Bucket Name
                </Label>
                <Input
                  id="bucket"
                  type="text"
                  placeholder="my-s3-bucket"
                  value={formData.bucketName}
                  onChange={(e) =>
                    handleInputChange("bucketName", e.target.value)
                  }
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
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Credentials"
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Security Note
            </h4>
            <p className="text-xs text-muted-foreground">
              Your AWS credentials are encrypted using AES-256 encryption before
              being stored. Your email address will not be changed during this
              update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
