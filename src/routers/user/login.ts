import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { User } from '../../entities/user';
import { newTokenPair } from '../../jwt/generate';
import { tokenPairResponse, tokenPairResponseType } from './schemas';
import { Static, Type } from '@sinclair/typebox';
import { comparePassword, encryptPassword } from './password';

const loginBody = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

type BodyType = Static<typeof loginBody>;

export const loginOptions: RouteShorthandOptions = {
  schema: {
    tags: ['User'],
    description: 'User login',
    body: loginBody,
    response: {
      200: tokenPairResponse,
    },
  },
};

export async function loginHandler(
  request: FastifyRequest<{ Body: BodyType; Reply: tokenPairResponseType }>,
  reply: FastifyReply,
) {
  const user = await User.findOneBy({ username: request.body.username });

  if (!user) {
    reply.status(401).send({ message: 'Invalid user or password' });
    return;
  }

  if (!(await comparePassword(request.body.password, user.password))) {
    reply.status(401).send({ message: 'Invalid user or password' });
    return;
  }

  reply.status(200).send(await newTokenPair(user));
}
