import { db } from "$/shared/db";
import { User } from "$/shared/db/schema";
import { DeleteOneSaveBody } from "../dtos/delete-save.dto";

export default async function SavesDeleteOneCommand(user: User, body: DeleteOneSaveBody) {
  return await db
    .deleteFrom("saves")
    .where("saves.user_id", "=", user.id)
    .where("saves.service", "=", body.service)
    .executeTakeFirstOrThrow();
}
