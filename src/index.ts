import "./shared/utils/logger";
import { ENV } from "./env";

import express from "express";
import cookieParser from "cookie-parser";
import http from "http";

import { UsersModule } from "./modules/users/users.module";
import { SavesModule } from "./modules/saves/saves.module";

// export const redis = createClient({
//   url: `redis://default:${ENV.REDIS_PASSWORD}@localhost:6379`,
// });

// await redis.connect();
// redis.on("error", (err) => console.log("Redis Client Error", err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);

app.use("/api/user", UsersModule);
app.use("/api/save", SavesModule);

const listener = server.listen(ENV.PORT, () => {
  const address = listener.address();
  if (!address || typeof address === "string") throw new Error();
  log.box(`Server started: http://localhost:${address.port}`);
});
