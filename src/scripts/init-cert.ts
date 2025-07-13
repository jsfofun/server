import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const saveFile = async (filename: string, data: string) => {
  const dir = path.join(process.cwd(), "/certificates/", filename);

  return fs.writeFile(dir, data);
};

(async () => {
  await saveFile("private.pem", privateKey);
  await saveFile("public.pem", publicKey);
})()
  .then(() => process.exit())
  .catch(() => process.exit());
