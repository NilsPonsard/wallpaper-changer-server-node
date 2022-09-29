import { Token } from '../entities/token';
import { User } from '../entities/user';
import { accessExpiration, verify } from './common';

export async function checkUser(authHeader: string): Promise<User | null> {
  try {
    const content = await verify(authHeader.replace('Bearer ', ''));

    if (typeof content === 'string') return null;

    const token = content?.token;

    if (!token) return null;

    const queryResult = await Token.findOne({
      where: { accessToken: token },
      relations: { user: true },
    });

    if (!queryResult) return null;

    const { user, createdAt } = queryResult;

    if (createdAt.getTime() + accessExpiration * 1000 < Date.now()) {
      // delete old accessToken
      token.delete({ accessToken: token });
      return null;
    }
    if (!user) return null;

    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
}
