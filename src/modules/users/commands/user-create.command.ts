import fail from "../../../shared/utils/fail";
import { db } from "$/shared/db";
import type { Response } from "express";
import { UsersLoginBody } from "../dtos/login.dto";
import UserValidateUsernameCommand from "./user-validate-username.command";
import UserValidatePasswordCommand from "./user-validate-password.command";
import UserSessionAuth from "../services/auth";
import PasswordManager from "../services/passwords";

export default async function UserRegisterCommand(res: Response, body: UsersLoginBody) {
  if (!UserValidateUsernameCommand(body.username)) return fail(400, "Invalid username");
  if (!UserValidatePasswordCommand(body.password)) return fail(400, "Invalid password");

  const password_hash = await PasswordManager.hash(body.password);

  const result = await db
    .insertInto("users")
    .values({ username: body.username, password_hash })
    .returningAll()
    .onConflict((cb) => cb.doNothing())
    .executeTakeFirst();

  if (!result) fail(400, "User already exists!");
  const { password_hash: password_res, ...user } = result;

  const sessionToken = UserSessionAuth.generateSessionToken();
  const session = await UserSessionAuth.createSession(sessionToken, user.id);
  UserSessionAuth.setSessionTokenCookie(res, sessionToken, session.expires_at);
  return user;
}
