import { db } from "$/shared/db/index";
import { saves, User } from "$/shared/db/schema";
import { GetOneSaveBody } from "@autopass/schemas";
import { and, eq } from "drizzle-orm";

export async function SavesGetOneQuery(user: User, params: GetOneSaveBody) {
  return await db
    .select()
    .from(saves)
    .where(and(eq(saves.user_id, user.id), eq(saves.website, params.website)))
    .execute();
}
