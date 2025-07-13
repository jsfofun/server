import { Type } from "@sinclair/typebox";

export const UpsertSaveDto = Type.Object({
  website: Type.String(),
  hash_data: Type.String(),
  form_id: Type.String(),
  form_classname: Type.String(),
  fields: Type.Record(Type.String(), Type.String()),
});

export type UpsertSaveBody = typeof UpsertSaveDto.static;
