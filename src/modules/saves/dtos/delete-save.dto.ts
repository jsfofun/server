import { Type } from "@sinclair/typebox";

export const DeleteOneSaveDto = Type.Object({
  service: Type.String({
    minLength: 3,
    maxLength: 31,
  }),
});

export type DeleteOneSaveBody = typeof DeleteOneSaveDto.static;
