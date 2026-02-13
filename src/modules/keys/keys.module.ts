import { Router } from "express";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import UseRoute from "$/middleware/wrapper";
import { PublicKeyResponseSchema } from "@autopass/schemas";

const PUBLIC_KEY_PATH = join(process.cwd(), "certificates", "public.pem");

/**
 * Reads the server's RSA public key from disk.
 * Cached on first read for performance.
 */
let cachedPublicKey: string | null = null;

const getPublicKey = async (): Promise<string> => {
  if (cachedPublicKey) return cachedPublicKey;
  cachedPublicKey = await readFile(PUBLIC_KEY_PATH, "utf-8");
  return cachedPublicKey;
};

export const KeysModule = Router();

KeysModule.get(
  "/public",
  UseRoute(
    async ({ response }) => {
      const publicKey = await getPublicKey();
      return { public_key: publicKey } satisfies { public_key: string };
    },
    {
      authRequired: false,
      response: PublicKeyResponseSchema,
    }
  )
);
