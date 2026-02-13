import fail from "$/shared/utils/fail";
import { UpsertSaveBody } from "@autopass/schemas";
import { User } from "$/shared/db/schema";
import { db } from "$/shared/db";
import { RawBuilder, sql } from "kysely";
import * as encryption from "$/shared/utils/encryption";

function json<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`;
}

/**
 * Сохраняет save. Требует клиентское шифрование (_encrypted).
 * Применяет дополнительное AES-256-GCM шифрование на сервере для хранения.
 */
export default async function UpsertSavesCommand(body: UpsertSaveBody, user: User) {
  if (!("_encrypted" in body.fields)) {
    fail(400, "Sensitive data must be encrypted by client. Send fields with _encrypted key.");
  }

  const ciphertext = encryption.encrypt(JSON.stringify(body.fields), user.id);
  const fieldsToStore = { _ciphertext: ciphertext };

  return await db
    .insertInto("saves")
    .values({
      fields: json(fieldsToStore),
      hash_data: body.hash_data,
      form_classname: body.form_classname,
      form_id: body.form_id,
      website: body.website,
      user_id: user.id,
    })
    .onConflict((cb) =>
      cb.columns(["website", "hash_data", "user_id"]).doUpdateSet((eb) => ({
        fields: eb.ref("excluded.fields"),
      }))
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}
