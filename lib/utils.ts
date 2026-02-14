import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateKey(key: string): boolean {
  if (!key) return false;
  // Prevent path traversal
  if (key.includes("..")) return false;
  return true;
}
