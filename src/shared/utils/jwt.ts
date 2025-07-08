import { ENV } from "$/env";
import jwt from "jsonwebtoken";
import fail from "./fail";
import { UserGetQuery } from "$/modules/users/queries/user-get.query";
// import { $set_user_online } from "$/features/user/services/online-user.service";

interface JWTData {
  username: string;
}

export const Bearer = {
  sign: (data: JWTData) => {
    return jwt.sign(data, ENV.SESSION_SECRET, { expiresIn: `4W` });
  },

  decode: (data: string) => {
    try {
      const parsed = jwt.verify(data, ENV.SESSION_SECRET);
      if (typeof parsed === "string") fail(401, "Invalid token");

      return <JWTData & jwt.JwtPayload>parsed;
    } catch (error) {
      fail(401, "Unauthorized!");
    }
  },

  verify: async (bearer?: string, type: "user" | (string & NonNullable<unknown>) = "user") => {
    if (!bearer) fail(401, "Unauthorized!");
    const [prefix, token] = bearer.split(" ");
    if (prefix !== "Bearer" || !token?.length) fail(401, "Unauthorized!");

    const decoded = Bearer.decode(token);

    if (type === "user") {
      // get and update last online
      // const user = await $set_user_online(decoded.user_id).catch(() => null);
      const user = await UserGetQuery({ username: decoded.username }).catch(() => null);
      if (!user) fail(401, "Unauthorized!");

      // Update & generate new token for user
      const generated = Bearer.sign({
        username: user.username,
      });
      const { password_hash, ...rest } = user;
      return {
        user: rest,
        token: generated,
      };
    }
    fail(401, "Not supported type of verification!");
  },
};
