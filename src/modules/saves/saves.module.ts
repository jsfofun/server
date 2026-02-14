import { Router } from "express";
import { GetOneSaveDto, UpsertSaveDto } from "@autopass/schemas";
import UseRoute from "$/middleware/wrapper";
import SavesDeleteOneCommand from "./commands/delete-save.command";
import UpsertSavesCommand from "./commands/upsert-data.command";
import { UsersSavesListQuery } from "./queries/users-saves-list.query";
import { DeleteOneSaveDto } from "@autopass/schemas";
import { SavesGetOneQuery } from "./queries/saves-get-one.query";

export const SavesModule = Router();

SavesModule.put(
  "/",
  UseRoute(({ body, user }) => UpsertSavesCommand(body, user), { body: UpsertSaveDto }),
);

SavesModule.delete(
  "/:id",
  UseRoute(({ params, user }) => SavesDeleteOneCommand(user, params), { params: DeleteOneSaveDto }),
);

SavesModule.get(
  "/",
  UseRoute(({ user }) => UsersSavesListQuery(user)),
);

SavesModule.get(
  "/:id",
  UseRoute(({ params, user }) => SavesGetOneQuery(user, params), { params: GetOneSaveDto }),
);
