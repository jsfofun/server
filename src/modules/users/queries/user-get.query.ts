import { db } from "$/shared/db";
import { SelectUserBody } from "@autopass/schemas";
import PasswordManager from "../services/passwords";

export async function UserGetQuery(body: SelectUserBody) {
  let password_hash: string | null = null;

  if (body.password) {
    password_hash = await PasswordManager.hash(body.password);
  }

  return db
    .selectFrom("users")
    .selectAll()
    .$if(Boolean(body.username), (cb) => cb.where("username", "=", body.username!))
    .$if(Boolean(password_hash), (cb) => cb.where("password_hash", "=", password_hash))
    .executeTakeFirst();
}
