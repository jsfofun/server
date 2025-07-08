import fail from "../../../shared/utils/fail";
import UserSessionAuth from "../services/auth";
import redirect from "$/shared/utils/redirect";
import type { Response } from "express";

export default async function UserLogoutCommand(event: Response) {
  if (!event.locals.session) return fail(401, "Unauthorized!");

  await UserSessionAuth.invalidateSession(event.locals.session.id);
  UserSessionAuth.deleteSessionTokenCookie(event);

  return redirect(302, "/login");
}
