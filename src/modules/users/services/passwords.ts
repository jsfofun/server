import { hash, verify } from "@node-rs/argon2";

async function HashPassword(password: string) {
  const password_hash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return password_hash;
}

async function VerifyPassword(hashed: string, password: string) {
  const password_hash = await verify(hashed, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return password_hash;
}
const PasswordManager = {
  hash: HashPassword,
  verify: VerifyPassword,
};

export default PasswordManager;
