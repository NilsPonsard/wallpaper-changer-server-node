import { Static, Type } from '@sinclair/typebox';
import { type } from 'os';

export const tokenPairResponse = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export type tokenPairResponseType = Static<typeof tokenPairResponse>;

export const userBody = Type.Object({
  id: Type.Number(),
  username: Type.String(),
  description: Type.String(),
});

export type userBodyType = Static<typeof userBody>;
