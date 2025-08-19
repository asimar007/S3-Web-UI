"use client";

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
import { Loader2, Key, Database, Globe, Folder } from "lucide-react";
import Image from "next/image";

interface CredentialSetupProps {
  onSetupComplete: () => void;
}

export default function CredentialSetup({
  onSetupComplete,
}: CredentialSetupProps) {
  const [formData, setFormData] = useState({
    awsAccessKeyId: "",
    awsSecretAccessKey: "",
    awsRegion: "ap-south-1",
    bucketName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Save credentials first
      const response = await fetch("/api/user/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Setup failed");
      }

      // Auto-configure CORS after successful credential setup
      try {
        const corsResponse = await fetch("/api/cors-setup", {
          method: "POST",
        });

        if (corsResponse.ok) {
          console.log(
            "CORS configured automatically for bucket:",
            formData.bucketName
          );
        } else {
          console.warn(
            "CORS setup failed, but credentials were saved successfully"
          );
        }
      } catch (corsError) {
        console.warn("CORS auto-setup failed:", corsError);
        // Don't fail the whole setup if CORS fails
      }

      setSuccess(true);
      setTimeout(() => {
        onSetupComplete();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-xl border bg-background/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Setup Complete!
              </h3>
              <p className="text-muted-foreground">
                Your AWS credentials have been saved securely.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="relative z-20 bg-transparent">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/images/S3.png"
                  alt="S3 Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">
                  S3 <span className="text-primary">Buddy</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center p-4 pt-16">
        <Card className="w-full max-w-lg shadow-xl border bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Key className="w-5 h-5 text-primary" />
              AWS Credentials Setup
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your AWS credentials to access your S3 buckets. Your
              credentials will be encrypted and stored securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="bg-background border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

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
                  placeholder="Enter your access key"
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Save Credentials
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Security Note
              </h4>
              <p className="text-xs text-muted-foreground">
                Your AWS credentials are encrypted using AES-256 encryption
                before being stored in our secure database. We never store your
                credentials in plain text.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
