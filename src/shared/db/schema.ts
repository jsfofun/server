import { pgTable, text, timestamp, bigserial } from "drizzle-orm/pg-core";

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
  expires_at: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const passwords = pgTable("passwords", {
  id: bigserial({ mode: "bigint" }).primaryKey(),
  user_id: bigserial({ mode: "bigint" })
    .notNull()
    .references(() => users.id),
  service: text().notNull(),
  website: text().notNull(),
  login_hash: text().notNull(),
  password_hash: text().notNull(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof users.$inferSelect;

export type Password = typeof passwords.$inferSelect;
