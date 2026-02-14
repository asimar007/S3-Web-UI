"use client";

import { useState } from "react";
import { useVault } from "@/components/vault-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

export default function VaultUnlocker() {
  const { isLocked, unlockVault, isLoading } = useVault();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  if (isLoading) return null;

  if (!isLocked) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const success = await unlockVault(password);
    if (!success) {
      setError(true);
    }
    setUnlocking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Unlock Your Vault</CardTitle>
          <CardDescription>
            Enter your Vault Password to decrypt your AWS credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="4-digit PIN"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className={`text-center text-2xl tracking-[0.5em] ${error ? "border-destructive ring-destructive" : ""}`}
                autoFocus
              />
              {error && (
                <p className="text-xs text-destructive text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Incorrect password
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={unlocking || password.length !== 4}
            >
              {unlocking ? (
                <span className="animate-pulse">Decrypting...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" /> Unlock
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Your credentials are decrypted locally and never sent to the
              server.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
