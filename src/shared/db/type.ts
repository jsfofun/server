import { Generated } from "kysely";
import * as table from "./schema";

export interface Database {
  session: table.Session;
  users: Omit<table.User, "id"> & {
    id: Generated<bigint>;
  };
  password: table.Password;
}
