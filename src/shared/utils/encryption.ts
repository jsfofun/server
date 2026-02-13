import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { ENV } from "$/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derives a unique AES key for the user from SESSION_SECRET + user_id.
 * Каждый пользователь получает свой ключ шифрования для saves.
 */
function deriveUserKey(userId: bigint): Buffer {
  const hmac = createHmac("sha256", ENV.SESSION_SECRET);
  hmac.update(userId.toString());
  return hmac.digest().subarray(0, KEY_LENGTH);
}

/**
 * AES-256-GCM encrypt. Returns base64(iv + authTag + ciphertext).
 */
export function encrypt(plaintext: string, userId: bigint): string {
  const key = deriveUserKey(userId);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString("base64");
}

/**
 * AES-256-GCM decrypt. Input: base64(iv + authTag + ciphertext).
 */
export function decrypt(ciphertextBase64: string, userId: bigint): string {
  const combined = Buffer.from(ciphertextBase64, "base64");
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const key = deriveUserKey(userId);
  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
