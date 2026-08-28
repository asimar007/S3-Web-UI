const BLOB_VERSION = 2;

const toBase64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes));

const fromBase64 = (s: string) =>
  Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// Vaults written before BLOB_VERSION 2 stored iv/data as hex. They must stay
// readable: the server holds no plaintext copy, so a failed decrypt is a
// permanent lockout for that user.
const fromHex = (s: string) =>
  Uint8Array.from(s.match(/.{1,2}/g)!, (b) => parseInt(b, 16));

export async function deriveKey(
  password: string,
  salt: string,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptVault(
  data: object,
  password: string,
): Promise<{ blob: string; salt: string }> {
  const salt = toBase64(window.crypto.getRandomValues(new Uint8Array(16)));
  const key = await deriveKey(password, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(data)),
  );

  return {
    blob: JSON.stringify({
      v: BLOB_VERSION,
      iv: toBase64(iv),
      data: toBase64(new Uint8Array(encrypted)),
    }),
    salt,
  };
}

export async function decryptVault(
  blobString: string,
  password: string,
  salt: string,
): Promise<{ awsAccessKeyId: string; awsSecretAccessKey: string }> {
  const { v, iv, data } = JSON.parse(blobString);
  const decode = v === BLOB_VERSION ? fromBase64 : fromHex;

  const key = await deriveKey(password, salt);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: decode(iv) },
      key,
      decode(data),
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "OperationError") {
      throw new Error("Incorrect Password");
    }
    throw error;
  }
}
