import fail from "../../../shared/utils/fail";
import UserSessionAuth from "../services/auth";
import type { Response } from "express";

export default async function UserLogoutCommand(event: Response) {
  if (!event.locals.session) return fail(401, "Unauthorized!");

  await UserSessionAuth.invalidateSession(event.locals.session.id);
  UserSessionAuth.deleteSessionTokenCookie(event);

  return { response: true };
}
