import { Type } from "@sinclair/typebox";

export const UpsertSaveDto = Type.Object({
  website: Type.String(),
  hash_data: Type.String(),
  fields: Type.Record(Type.String(), Type.String()),
});

export type UpsertSaveBody = typeof UpsertSaveDto.static;
