import { Type } from "@sinclair/typebox";

export const DevicesConnectDto = Type.Object({
  public_key: Type.String(),
  device_name: Type.String(),
});

export type DevicesConnectBody = typeof DevicesConnectDto.static;
