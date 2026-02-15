import fail from "$/shared/utils/fail";
import { UpsertSaveBody } from "@autopass/schemas";
import { User } from "$/shared/db/schema";
import { db } from "$/shared/db";
import { RawBuilder, sql } from "kysely";

function json<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`;
}

/**
 * Zero-knowledge: stores client-encrypted fields as-is. Server cannot decrypt.
 */
export default async function UpsertSavesCommand(body: UpsertSaveBody, user: User) {
  if (!("_encrypted" in body.fields)) {
    return fail(
      400,
      "Sensitive data must be encrypted by client. Send fields with _encrypted key.",
    );
  }

  return await db
    .insertInto("saves")
    .values({
      fields: json({ _encrypted: body.fields["_encrypted"] }),
      hash_data: body.hash_data,
      form_classname: body.form_classname,
      form_id: body.form_id,
      website: body.website,
      user_id: user.id,
    })
    .onConflict((cb) =>
      cb.columns(["website", "hash_data", "user_id"]).doUpdateSet((eb) => ({
        fields: eb.ref("excluded.fields"),
      })),
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}
