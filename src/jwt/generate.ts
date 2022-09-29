import { randomUUID } from 'crypto';
import { Token } from '../entities/token';
import { User } from '../entities/user';
import { accessExpiration, refreshExpiration, sign } from './common';

export async function newTokenPair(user: User) {
  const tokenPair = new Token();
  const rawRefreshToken = randomUUID();
  const rawAccessToken = randomUUID();

  const accessToken = await sign({ token: rawAccessToken }, accessExpiration);
  const refreshToken = await sign({ token: rawRefreshToken }, refreshExpiration);

  tokenPair.accessToken = rawAccessToken;
  tokenPair.refreshToken = rawRefreshToken;
  tokenPair.user = user;
  tokenPair.save();

  return { accessToken, refreshToken };
}
