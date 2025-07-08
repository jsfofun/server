import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import type { Request, Response } from "express";
import * as table from "$/shared/db/schema";
import { db } from "$/shared/db";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = "auth-session";

function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase64url(bytes);
  return token;
}

async function createSession(token: string, user_id: bigint) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: table.Session = {
    id: sessionId,
    user_id,
    expires_at: new Date(Date.now() + DAY_IN_MS * 30),
  };

  await db.insertInto("session").values(session).execute();
  return session;
}

async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await db
    .selectFrom("session")
    .innerJoin("users", "session.user_id", "users.id")
    .where("session.id", "=", sessionId)
    .select((cb) => [cb.fn.toJson("session").as("session"), cb.fn.toJson("users").as("user")])
    .execute();

  if (!result) return { session: null, user: null };
  const { session, user } = result;

  if (session) {
    const expires_at = new Date(session.expires_at);
    const sessionExpired = Date.now() >= expires_at.getTime();
    if (sessionExpired) {
      await db.deleteFrom("session").where("session.id", "=", session.id).execute();
      return { session: null, user: null };
    }
    const renewSession = Date.now() >= expires_at.getTime() - DAY_IN_MS * 15;
    if (renewSession) {
      session.expires_at = new Date(Date.now() + DAY_IN_MS * 30);
      await db.updateTable("session").set({ expires_at: expires_at }).execute();
      // .where(eq(session.id, session.id));
    }
  }
  return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
  await db.deleteFrom("session").where("session.id", "=", sessionId).execute();
}

export function setSessionTokenCookie(event: Response, token: string, expiresAt: Date) {
  event.cookie(sessionCookieName, token, {
    expires: new Date(expiresAt),
    path: "/",
  });
}

export function deleteSessionTokenCookie(event: Response) {
  event.cookie(sessionCookieName, "", { path: "/", expires: new Date(0) });
}

const UserSessionAuth = {
  generateSessionToken,
  createSession,
  validateSessionToken,
  setSessionTokenCookie,
  invalidateSession,
  deleteSessionTokenCookie,
};

export default UserSessionAuth;
