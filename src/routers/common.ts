import { Static, Type } from '@sinclair/typebox';

export const messageResponse = Type.Object({
  message: Type.String(),
});

export type messageResponseType = Static<typeof messageResponse>;
