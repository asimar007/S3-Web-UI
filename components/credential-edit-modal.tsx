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
      <div className="absolute inset-0 z-10"></div>

      <Card className="relative z-20 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-black">
              <Key className="w-5 h-5 text-gray-700" />
              Edit AWS Credentials
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-white/20 text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-700">
            Update your AWS credentials and S3 bucket configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fetchLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading current credentials...</span>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Updated Successfully!
              </h3>
              <p className="text-gray-600">
                Your AWS credentials have been updated.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="accessKey"
                  className="flex items-center gap-2 text-gray-900 font-medium"
                >
                  <Key className="w-4 h-4 text-black" />
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
                  className="bg-transparent border-white/30 focus:border-white/50 text-gray-900 placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="secretKey"
                  className="flex items-center gap-2 text-gray-900 font-medium"
                >
                  <Key className="w-4 h-4 text-black font-bold" />
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
                  className="bg-transparent border-white/30 focus:border-white/50 text-gray-900 placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="region"
                  className="flex items-center gap-2 text-gray-900 font-medium"
                >
                  <Globe className="w-4 h-4 text-gray-700" />
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
                  className="bg-transparent border-white/30 focus:border-white/50 text-gray-900 placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bucket"
                  className="flex items-center gap-2 text-gray-900 font-medium"
                >
                  <Folder className="w-4 h-4 text-gray-700" />
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
                  className="bg-transparent border-white/30 focus:border-white/50 text-gray-900 placeholder:text-gray-600"
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
                  className="flex-1 border-white/30 text-gray-800 hover:bg-white/20"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white"
                  disabled={loading}
                >
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

          <div className="mt-6 p-4 bg-white/20 rounded-lg border border-white/30">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Security Note
            </h4>
            <p className="text-xs text-gray-800">
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
