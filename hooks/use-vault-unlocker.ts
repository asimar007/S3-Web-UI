"use client";

import { useState } from "react";
import { useVault } from "@/components/vault-provider";

export function useVaultUnlocker() {
  const { isLocked, unlockVault, isLoading } = useVault();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const success = await unlockVault(password);
    if (!success) {
      setError(true);
    }
  };

  return {
    isLocked,
    isLoading,
    password,
    setPassword,
    error,
    handleUnlock,
  };
}
