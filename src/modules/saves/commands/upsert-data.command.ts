// import fail from "../../../shared/utils/fail";
import { UpsertSaveBody } from "../dtos/upsert-save.dto";
// import PasswordManager from "../services/passwords";
import { User } from "$/shared/db/schema";
import { db } from "$/shared/db";

export default async function UpsertSavesCommand(body: UpsertSaveBody, user: User) {
  // const password_hash = await PasswordManager.hash(body.password_hash);
  // if (!password_hash) return fail(500, "Unavailable to hash password");

  // const login_hash = await PasswordManager.hash(body.login_hash);
  // if (!login_hash) return fail(500, "Unavailable to hash login");

  return await db
    .insertInto("saves")
    .values({
      login_hash: body.login_hash,
      password_hash: body.password_hash,
      website: body.website,
      user_id: user.id,
    })
    .onConflict((cb) =>
      cb.columns(["website", "user_id"]).doUpdateSet((eb) => ({
        login_hash: eb.ref("excluded.login_hash"),
        password_hash: eb.ref("excluded.password_hash"),
      }))
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}
