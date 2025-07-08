// import * as table from "$/shared/db/schema";
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
export const SelectUserDto = Type.Object({
  username: Type.Optional(
    Type.String({
      minLength: 3,
      maxLength: 31,
      pattern: "^[a-z0-9_-]+$",
    })
  ),

  password: Type.Optional(
    Type.String({
      minLength: 6,
      maxLength: 256,
    })
  ),
});

export type SelectUserBody = typeof SelectUserDto.static;
