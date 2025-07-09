import { db } from "$/shared/db";
import { User } from "$/shared/db/schema";

export function UsersSavesListQuery(user: User) {
  return db.selectFrom("saves").selectAll().where("user_id", "=", user.id).execute();
}
