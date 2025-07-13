import { Router } from "express";
import { UsersLoginDto } from "@autopass/schemas";
import UseRoute from "$/middleware/wrapper";
import UserLoginCommand from "./commands/user-login.command";
import UserLogoutCommand from "./commands/user-logout.command";
import UserRegisterCommand from "./commands/user-create.command";

export const UsersModule = Router();

UsersModule.post(
  "/register",
  UseRoute(({ body, response }) => UserRegisterCommand(response, body), {
    body: UsersLoginDto,
    authRequired: false,
  })
);

UsersModule.post(
  "/login",
  UseRoute(({ body, response }) => UserLoginCommand(response, body), {
    body: UsersLoginDto,
    authRequired: false,
  })
);

UsersModule.delete(
  "/logout",
  UseRoute(({ response }) => UserLogoutCommand(response))
);

UsersModule.delete(
  "/logout",
  UseRoute(({ user }) => user)
);
