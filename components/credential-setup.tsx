"use client";

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
import { Loader2, Key, Lock } from "lucide-react";
import { useCredentialSetup } from "@/hooks/use-credential-setup";

interface CredentialSetupProps {
  onSetupComplete: () => void;
}

export default function CredentialSetup({
  onSetupComplete,
}: CredentialSetupProps) {
  const {
    formData,
    vaultPassword,
    confirmVaultPassword,
    loading,
    error,
    success,
    handleInputChange,
    setVaultPassword,
    setConfirmVaultPassword,
    handleSubmit,
  } = useCredentialSetup({ onSetupComplete });

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
                Your Vault is created and keys are encrypted locally.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center p-4 pt-16">
        <Card className="w-full max-w-lg shadow-xl border bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lock className="w-5 h-5 text-primary" />
              Secure Vault Setup
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create a Vault Password to encrypt your AWS keys. <br />
              <span className="font-bold text-amber-500">
                We cannot recover this password if you lose it.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="p-4 border border-primary/20 bg-primary/5 rounded-md space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4" /> AWS Keys (Encrypted Locally)
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="accessKey">AWS Access Key ID</Label>
                  <Input
                    id="accessKey"
                    value={formData.awsAccessKeyId}
                    onChange={(e) =>
                      handleInputChange("awsAccessKeyId", e.target.value)
                    }
                    required
                    placeholder="AKIA..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey">AWS Secret Access Key</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={formData.awsSecretAccessKey}
                    onChange={(e) =>
                      handleInputChange("awsSecretAccessKey", e.target.value)
                    }
                    required
                    placeholder="Secret Key..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">AWS Region</Label>
                  <Input
                    id="region"
                    value={formData.awsRegion}
                    onChange={(e) =>
                      handleInputChange("awsRegion", e.target.value)
                    }
                    required
                    placeholder="ap-south-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bucket">S3 Bucket Name</Label>
                  <Input
                    id="bucket"
                    value={formData.bucketName}
                    onChange={(e) =>
                      handleInputChange("bucketName", e.target.value)
                    }
                    required
                    placeholder="my-bucket"
                  />
                </div>
              </div>

              <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-md space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-500">
                  <Lock className="w-4 h-4" /> Create Vault Password
                </h4>
                <p className="text-xs text-muted-foreground">
                  This password encrypts your keys in the browser. We never see
                  it.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="vaultPass">4-Digit PIN</Label>
                  <Input
                    id="vaultPass"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={vaultPassword}
                    onChange={(e) =>
                      setVaultPassword(
                        e.target.value.replace(/\D/g, "").slice(0, 4),
                      )
                    }
                    required
                    placeholder="Enter 4-digit PIN"
                    className="border-amber-500/30 focus:border-amber-500 text-center text-2xl tracking-[0.5em]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmVaultPass">Confirm 4-Digit PIN</Label>
                  <Input
                    id="confirmVaultPass"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={confirmVaultPassword}
                    onChange={(e) =>
                      setConfirmVaultPassword(
                        e.target.value.replace(/\D/g, "").slice(0, 4),
                      )
                    }
                    required
                    placeholder="Confirm PIN"
                    className="border-amber-500/30 focus:border-amber-500 text-center text-2xl tracking-[0.5em]"
                  />
                </div>
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
                    Encrypting & Saving...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Save to Secure Vault
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
