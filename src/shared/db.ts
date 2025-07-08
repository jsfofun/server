import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import { ENV } from "../env";
import { Database } from "./db/type";

const { Pool } = pg;

const pool = new Pool({ connectionString: ENV.DATABASE_URL });

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<Database>({ dialect });
