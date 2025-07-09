import fail from "../../../shared/utils/fail";
import { db } from "$/shared/db";
import type { Response } from "express";
import { UpsertSaveBody } from "../dtos/upsert-save.dto";
import PasswordManager from "../services/passwords";

export default async function SavesInsertOneCommand(res: Response, body: UpsertSaveBody) {
  const password_hash = await PasswordManager.hash(body.password);

  const result = await db
    .insertInto("users")
    .values({ username: body.username, password_hash })
    .returningAll()
    .onConflict((cb) => cb.doNothing())
    .executeTakeFirst();

  if (!result) fail(400, "User already exists!");
  const { password_hash: password_res, ...user } = result;

  return user;
}
