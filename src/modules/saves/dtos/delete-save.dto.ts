import { Type } from "@sinclair/typebox";

export const DeleteOneSaveDto = Type.Object({
  website: Type.String({
    minLength: 3,
    format: "uri",
  }),
});

export type DeleteOneSaveBody = typeof DeleteOneSaveDto.static;
