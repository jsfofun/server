import { pgTable, text, timestamp, bigserial, unique, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigserial({ mode: "bigint" }).primaryKey(),
  username: text("username").notNull().unique(),
  password_hash: text("password_hash").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  user_id: bigserial({ mode: "bigint" })
    .notNull()
    .references(() => users.id),
  public_key: text().notNull(),
  device_info: text().notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const saves = pgTable(
  "saves",
  {
    id: bigserial({ mode: "bigint" }).primaryKey(),
    user_id: bigserial({ mode: "bigint" })
      .notNull()
      .references(() => users.id),
    website: text().notNull(),
    form_id: text().notNull(),
    form_classname: text().notNull(),
    hash_data: text().notNull(),
    fields: json().notNull().$type<{ password: string; [x: string]: string }>(),
  },
  (cb) => [unique("saves_user_id_service_uk").on(cb.user_id, cb.website, cb.hash_data)]
);

export type Session = typeof session.$inferSelect;

export type User = typeof users.$inferSelect;

export type Saves = typeof saves.$inferSelect;
