import { Type } from "@sinclair/typebox";

export const DevicesDeleteOneDto = Type.Object({
  id: Type.BigInt(),
});

export type DevicesDeleteOneBody = typeof DevicesDeleteOneDto.static;
