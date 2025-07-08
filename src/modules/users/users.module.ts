import { Router } from "express";
import { UsersLoginDto } from "./dtos/login.dto";
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

UsersModule.post(
  "/logout",
  UseRoute(({ response }) => UserLogoutCommand(response), {})
);
