import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateKey(key: string): boolean {
  if (!key) return false;
  // Prevent path traversal
  if (key.includes("..")) return false;
  // Basic S3 key validation (allow alphanumeric, slashes, dashes, underscores, dots, spaces)
  // We can be a bit more permissive but definitely block '..'
  return true;
}
