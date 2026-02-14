"use client";

import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useState, useEffect } from "react";
import { decryptVault } from "@/lib/crypto-client";

interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
}

interface VaultContextType {
  isLocked: boolean;
  credentials: AWSCredentials | null;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  vaultBlob: string | null;
  vaultSalt: string | null;
  setVaultData: (blob: string, salt: string) => void;
  isLoading: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState<AWSCredentials | null>(null);
  const [vaultBlob, setVaultBlob] = useState<string | null>(null);
  const [vaultSalt, setVaultSalt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded, userId } = useAuth();

  // Fetch encrypted blob on mount OR when user signs in
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
          if (data.encryptedBlob && data.vaultSalt) {
            setVaultBlob(data.encryptedBlob);
            setVaultSalt(data.vaultSalt);

            // Try to auto-unlock if password is in session storage
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
                // Stored password invalid or decryption failed, clear it
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

    // Reset state if user logs out - ONLY when auth is loaded
    if (isLoaded && !userId) {
      setVaultBlob(null);
      setVaultSalt(null);
      setCredentials(null);
      sessionStorage.removeItem("vault_password");
    }

    fetchBlob();
  }, [isLoaded, userId]);

  // Simple check: Locked if we have a blob but no keys
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
        // Save password to session storage for persistence during reload
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

  const lockVault = () => {
    setCredentials(null);
    sessionStorage.removeItem("vault_password");
  };

  const setVaultData = (blob: string, salt: string) => {
    setVaultBlob(blob);
    setVaultSalt(salt);
  };

  return (
    <VaultContext.Provider
      value={{
        isLocked,
        credentials,
        unlockVault,
        lockVault,
        vaultBlob,
        vaultSalt,
        setVaultData,
        isLoading,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
