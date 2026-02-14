"use client";

import { useRef, useEffect } from "react";
import { useVaultUnlocker } from "@/hooks/use-vault-unlocker";
import { ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VaultUnlocker() {
  const {
    isLocked,
    isLoading,
    password,
    setPassword,
    error,
    unlocking,
    handleUnlock,
  } = useVaultUnlocker();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-submit when all 4 digits are entered
  useEffect(() => {
    if (password.length === 4) {
      formRef.current?.requestSubmit();
    }
  }, [password]);

  // Clear PIN and refocus on error so user can retry immediately
  useEffect(() => {
    if (error) {
      setPassword("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [error, setPassword]);

  if (isLoading) return null;
  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-xs mx-4">
        <form ref={formRef} onSubmit={handleUnlock}>
          {/* Hidden input captures all keyboard input */}
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            maxLength={4}
            value={password}
            onChange={(e) =>
              setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            autoFocus
            autoComplete="off"
            className="sr-only"
          />

          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
            {/* Icon */}
            <div
              className={cn(
                "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 border",
                error
                  ? "bg-destructive/10 border-destructive/30"
                  : "bg-primary/10 border-primary/20"
              )}
            >
              {error ? (
                <ShieldX className="w-7 h-7 text-destructive" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-primary" />
              )}
            </div>

            <h2 className="text-lg font-semibold tracking-tight mb-1">
              Unlock Vault
            </h2>
            <p
              className={cn(
                "text-sm mb-7 transition-colors duration-200",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {error ? "Incorrect PIN — try again" : "Enter your 4-digit PIN"}
            </p>

            {/* 4 PIN boxes */}
            <div
              className={cn(
                "flex gap-3 justify-center mb-6 cursor-text",
                error && "animate-shake"
              )}
              onClick={() => inputRef.current?.focus()}
            >
              {Array.from({ length: 4 }).map((_, i) => {
                const isFilled = i < password.length;
                const isActive = i === password.length && !unlocking;

                return (
                  <div
                    key={i}
                    className={cn(
                      "w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-150 select-none",
                      // Active slot
                      isActive &&
                        "border-primary scale-[1.06] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]",
                      // Filled slot
                      isFilled && !error && "border-primary/50 bg-primary/5",
                      isFilled && error && "border-destructive/50 bg-destructive/5",
                      // Empty unfocused
                      !isFilled && !isActive && "border-border bg-muted/30",
                      // Decrypting fade
                      unlocking && isFilled && "opacity-50"
                    )}
                  >
                    {isFilled ? (
                      // Filled dot
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full transition-colors",
                          error ? "bg-destructive" : "bg-primary",
                          unlocking && "animate-pulse"
                        )}
                      />
                    ) : isActive ? (
                      // Blinking cursor in active empty slot
                      <div
                        className="w-px h-5 bg-primary"
                        style={{ animation: "blink 1.1s step-end infinite" }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {unlocking && (
              <p className="text-xs text-muted-foreground animate-pulse mb-2">
                Decrypting…
              </p>
            )}

            <p className="text-[11px] text-muted-foreground/50 mt-4">
              Decrypted locally · never sent to server
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
