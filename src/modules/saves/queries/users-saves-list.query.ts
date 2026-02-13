import { db } from "$/shared/db";
import { User } from "$/shared/db/schema";
import * as encryption from "$/shared/utils/encryption";

export async function UsersSavesListQuery(user: User) {
  const rows = await db.selectFrom("saves").selectAll().where("user_id", "=", user.id).execute();

  return rows.map((row) => {
    const fields = row.fields as { _ciphertext?: string; _encrypted?: string; [k: string]: unknown };
    if (fields._ciphertext) {
      const decrypted = encryption.decrypt(fields._ciphertext, user.id);
      return { ...row, fields: JSON.parse(decrypted) as Record<string, string> };
    }
    return row;
  });
}
