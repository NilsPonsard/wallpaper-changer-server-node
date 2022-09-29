import { randomUUID } from 'crypto';
import { User } from '../entities/user';

/**
 * Generates a new client token for the user and saves it to the database
 */
export async function newClientTokenForUser(user: User) {
  const token = randomUUID();
  user.clientToken = token;
  await user.save();
  return token;
}
