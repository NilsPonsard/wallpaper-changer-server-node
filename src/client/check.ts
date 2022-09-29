import { User } from '../entities/user';

export async function checkClientToken(clientToken: string) {
  const user = await User.findOne({ where: { clientToken } });
  if (!user) {
    throw new Error('Invalid client token');
  }
  return user;
}
