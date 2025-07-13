import type { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/fail";
import { Bearer } from "../utils/jwt";
import { UserGetQuery } from "$/modules/users/queries/user-get.query";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers["authorization"];
  if (!bearer) return next(new APIError(401, "Unauthorized"));
  const profile = await Bearer.verify(bearer);

  if (!profile) return next(new APIError(401, "Unauthorized"));
  const user = await UserGetQuery({ username: profile.user.username });
  if (!user) return next(new APIError(401, "Unauthorized"));
  res.locals["user"] = user;

  return next();
};
