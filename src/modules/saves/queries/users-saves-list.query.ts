import { db } from "$/shared/db";
import { User } from "$/shared/db/schema";

/** Zero-knowledge: returns raw ciphertext. Client decrypts with DEK. */
export async function UsersSavesListQuery(user: User) {
  const rows = await db.selectFrom("saves").selectAll().where("user_id", "=", user.id).execute();
  return rows;
}
