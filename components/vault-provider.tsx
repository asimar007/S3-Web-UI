"use client";

import React, { createContext, useContext } from "react";
import { useVaultState } from "@/hooks/use-vault-state";

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
  const vaultState = useVaultState();

  return (
    <VaultContext.Provider value={vaultState}>
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
