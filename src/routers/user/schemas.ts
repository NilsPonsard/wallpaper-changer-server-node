import { Static, Type } from '@sinclair/typebox';

export const tokenPairResponse = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export type tokenPairResponseType = Static<typeof tokenPairResponse>;
