// import fail from "../../../shared/utils/fail";
import { UpsertSaveBody } from "@autopass/schemas";
// import PasswordManager from "../services/passwords";
import { User } from "$/shared/db/schema";
import { db } from "$/shared/db";
import { RawBuilder, sql } from "kysely";

function json<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`;
}
export default async function UpsertSavesCommand(body: UpsertSaveBody, user: User) {
  // const password_hash = await PasswordManager.hash(body.password_hash);
  // if (!password_hash) return fail(500, "Unavailable to hash password");

  // const login_hash = await PasswordManager.hash(body.login_hash);
  // if (!login_hash) return fail(500, "Unavailable to hash login");

  return await db
    .insertInto("saves")
    .values({
      fields: json({
        ...body.fields,
        password: body.fields["password"],
      }),
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
