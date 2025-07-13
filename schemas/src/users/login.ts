import { Type } from "@sinclair/typebox";

export const UsersLoginDto = Type.Object({
  username: Type.String({
    minLength: 3,
    maxLength: 31,
    pattern: "^[a-z0-9_-]+$",
  }),

  password: Type.String({
    minLength: 6,
    maxLength: 256,
  }),
});

export type UsersLoginBody = typeof UsersLoginDto.static;
