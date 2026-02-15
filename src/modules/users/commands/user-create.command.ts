import fail from "../../../shared/utils/fail";
import { db } from "$/shared/db";
import { UsersLoginBody } from "@autopass/schemas";
import type { Response } from "express";
import UserValidateUsernameCommand from "./user-validate-username.command";
import UserValidatePasswordCommand from "./user-validate-password.command";
import UserSessionAuth from "../services/auth";
import PasswordManager from "../services/passwords";

export default async function UserRegisterCommand(res: Response, body: UsersLoginBody) {
  if (!UserValidateUsernameCommand(body.username)) return fail(400, "Invalid username");
  if (!UserValidatePasswordCommand(body.password)) return fail(400, "Invalid password");
  if (!body.salt || !body.encrypted_dek) {
    return fail(400, "Zero-knowledge vault requires salt and encrypted_dek");
  }

  const password_hash = await PasswordManager.hash(body.password);

  const result = await db
    .insertInto("users")
    .values({ username: body.username, password_hash })
    .returningAll()
    .onConflict((cb) => cb.doNothing())
    .executeTakeFirst();

  if (!result) return fail(400, "User already exists!");
  const { password_hash: _ph, ...user } = result;

  await db
    .insertInto("user_vault")
    .values({
      user_id: user.id,
      salt: body.salt,
      encrypted_dek: body.encrypted_dek,
    })
    .execute();

  const sessionToken = UserSessionAuth.generateSessionToken();
  const session = await UserSessionAuth.createSession(
    sessionToken,
    user.id,
    body.device_info,
    body.public_key ?? ""
  );
  UserSessionAuth.setSessionTokenCookie(res, sessionToken, session.expires_at);
  return user;
}
