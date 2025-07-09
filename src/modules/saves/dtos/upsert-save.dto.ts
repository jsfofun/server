import { Type } from "@sinclair/typebox";

export const UpsertSaveDto = Type.Object({
  website: Type.String(),
  login_hash: Type.String(),
  password_hash: Type.String(),
});

export type UpsertSaveBody = typeof UpsertSaveDto.static;
