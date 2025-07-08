import { db } from "$/shared/db";
import { hash } from "@node-rs/argon2";
import { SelectUserBody } from "../dtos/login.dto";

export async function UserGetQuery(body: SelectUserBody) {
  let password_hash: string | null = null;

  if (body.password) {
    password_hash = await hash(body.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
  }

  return db
    .selectFrom("users")
    .selectAll()
    .$if(Boolean(body.username), (cb) => cb.where("username", "=", body.username!))
    .$if(Boolean(password_hash), (cb) => cb.where("password_hash", "=", password_hash))
    .executeTakeFirst();
}
