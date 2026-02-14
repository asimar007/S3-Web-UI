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
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const key = await deriveKey(password, saltHex);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const enc = new TextEncoder();
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(JSON.stringify(data)),
  );

  // Pack IV + Ciphertext
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const cipherArray = new Uint8Array(encrypted);
  const cipherHex = Array.from(cipherArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    blob: JSON.stringify({ iv: ivHex, data: cipherHex }),
    salt: saltHex,
  };
}

export async function decryptVault(
  blobString: string,
  password: string,
  salt: string,
): Promise<{ awsAccessKeyId: string; awsSecretAccessKey: string }> {
  const { iv: ivHex, data: cipherHex } = JSON.parse(blobString);

  const key = await deriveKey(password, salt);

  const iv = new Uint8Array(
    ivHex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)),
  );
  const cipher = new Uint8Array(
    cipherHex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)),
  );

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipher,
    );
    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "OperationError") {
      throw new Error("Incorrect Password");
    }
    throw error;
  }
}
