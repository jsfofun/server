import fail from "../../../shared/utils/fail";
import { db } from "$/shared/db";
import UserSessionAuth from "../services/auth";
import type { Response } from "express";
import { UsersLoginBody } from "../dtos/login.dto";
import UserValidateUsernameCommand from "./user-validate-username.command";
import PasswordManager from "../services/passwords";
import UserValidatePasswordCommand from "./user-validate-password.command";

export default async function UserLoginCommand(res: Response, body: UsersLoginBody) {
  if (!UserValidateUsernameCommand(body.username)) {
    return fail(400, "Invalid username (min 3, max 31 characters, alphanumeric only)");
  }
  if (!UserValidatePasswordCommand(body.password)) {
    return fail(400, "Invalid password (min 6, max 255 characters)");
  }

  const result = await db
    .selectFrom("users")
    .where("users.username", "=", body.username)
    .selectAll()
    .executeTakeFirst();

  if (!result) return fail(400, "Incorrect username or password");
  const { password_hash, ...user } = result;

  const validPassword = await PasswordManager.verify(password_hash, body.password);

  if (!validPassword) return fail(400, "Incorrect username or password");

  const sessionToken = UserSessionAuth.generateSessionToken();
  const session = await UserSessionAuth.createSession(sessionToken, user.id);
  UserSessionAuth.setSessionTokenCookie(res, sessionToken, session.expires_at);

  return user;
}
