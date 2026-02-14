"use client";

import { useState } from "react";
import { encryptVault } from "@/lib/crypto-client";
import { useVault } from "@/components/vault-provider";

interface UseCredentialSetupProps {
  onSetupComplete: () => void;
}

export function useCredentialSetup({
  onSetupComplete,
}: UseCredentialSetupProps) {
  const { setVaultData, unlockVault } = useVault();

  const [formData, setFormData] = useState({
    awsAccessKeyId: "",
    awsSecretAccessKey: "",
    awsRegion: "ap-south-1",
    bucketName: "",
    email: "",
  });

  const [vaultPassword, setVaultPassword] = useState("");
  const [confirmVaultPassword, setConfirmVaultPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (vaultPassword !== confirmVaultPassword) {
      setError("Vault passwords do not match");
      setLoading(false);
      return;
    }

    if (vaultPassword.length !== 4) {
      setError("PIN must be exactly 4 digits");
      setLoading(false);
      return;
    }

    try {
      // 1. Client-Side Encryption (Zero Knowledge)
      const credentialsToEncrypt = {
        awsAccessKeyId: formData.awsAccessKeyId,
        awsSecretAccessKey: formData.awsSecretAccessKey,
      };

      const { blob: encryptedBlob, salt: vaultSalt } = await encryptVault(
        credentialsToEncrypt,
        vaultPassword,
      );

      // 2. Send to Server (Server sees ONLY blob)
      // Note: vaultVerificationToken logic has been removed as per previous refactor
      const payload = {
        encryptedBlob,
        vaultSalt,
        awsRegion: formData.awsRegion,
        bucketName: formData.bucketName,
        email: formData.email,
      };

      const response = await fetch("/api/user/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Setup failed");
      }

      // Update context and unlock
      setVaultData(encryptedBlob, vaultSalt);
      await unlockVault(vaultPassword);

      // 3. Auto-configure CORS (Optional but helpful)
      try {
        const corsResponse = await fetch("/api/cors-setup", {
          method: "POST",
          headers: {
            "x-aws-access-key-id": formData.awsAccessKeyId,
            "x-aws-secret-access-key": formData.awsSecretAccessKey,
          },
        });

        if (corsResponse.ok) {
          console.log(
            "CORS configured automatically for bucket:",
            formData.bucketName,
          );
        } else {
          console.warn(
            "CORS setup failed, but credentials were saved successfully",
          );
        }
      } catch (corsError) {
        console.warn("CORS auto-setup failed:", corsError);
      }

      setSuccess(true);
      setTimeout(() => {
        onSetupComplete();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
