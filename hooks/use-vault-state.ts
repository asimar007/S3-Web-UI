"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { decryptVault } from "@/lib/crypto-client";

interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
}

interface BucketConfig {
  bucketName: string;
  awsRegion: string;
}

export function useVaultState() {
  const [credentials, setCredentials] = useState<AWSCredentials | null>(null);
  const [vaultBlob, setVaultBlob] = useState<string | null>(null);
  const [vaultSalt, setVaultSalt] = useState<string | null>(null);
  const [bucket, setBucket] = useState<BucketConfig | null>(null);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    async function fetchBlob() {
      if (!isLoaded || !userId) {
        if (isLoaded && !userId) setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user/credentials");
        if (res.ok) {
          const data = await res.json();
          setHasCredentials(true);
          setBucket({
            bucketName: data.bucketName,
            awsRegion: data.awsRegion,
          });

          if (data.encryptedBlob && data.vaultSalt) {
            setVaultBlob(data.encryptedBlob);
            setVaultSalt(data.vaultSalt);

            const storedPassword = sessionStorage.getItem("vault_password");
            if (storedPassword) {
              try {
                const decrypted = await decryptVault(
                  data.encryptedBlob,
                  storedPassword,
                  data.vaultSalt,
                );
                if (decrypted && decrypted.awsAccessKeyId) {
                  setCredentials({
                    accessKeyId: decrypted.awsAccessKeyId,
                    secretAccessKey: decrypted.awsSecretAccessKey,
                  });
                }
              } catch {
                sessionStorage.removeItem("vault_password");
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch vault data", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && !userId) {
      setVaultBlob(null);
      setVaultSalt(null);
      setCredentials(null);
      setBucket(null);
      setHasCredentials(false);
      sessionStorage.removeItem("vault_password");
    }

    fetchBlob();
  }, [isLoaded, userId]);

  const isLocked = !!vaultBlob && !credentials;

  const unlockVault = async (password: string) => {
    if (!vaultBlob || !vaultSalt) return false;

    try {
      const data = await decryptVault(vaultBlob, password, vaultSalt);
      if (data && data.awsAccessKeyId) {
        setCredentials({
          accessKeyId: data.awsAccessKeyId,
          secretAccessKey: data.awsSecretAccessKey,
        });
        sessionStorage.setItem("vault_password", password);
        return true;
      }
      return false;
    } catch (e: unknown) {
      if (e instanceof Error && e.message !== "Incorrect Password") {
        console.error("Failed to unlock vault", e);
      }
      return false;
    }
  };

  const setVaultData = (
    blob: string,
    salt: string,
    config: BucketConfig,
  ) => {
    setVaultBlob(blob);
    setVaultSalt(salt);
    setBucket(config);
  };

  return {
    isLocked,
    credentials,
    unlockVault,
    setVaultData,
    hasCredentials,
    bucket,
    isLoading,
  };
}
