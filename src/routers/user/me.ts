import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { checkUser } from '../../jwt/check';

const userBody = Type.Object({
  username: Type.String(),
  email: Type.String(),
  description: Type.String(),
});

export const meOptions: RouteShorthandOptions = {
  schema: {
    security: [{ jwt: [] }],
    description: 'User me',
    response: {
      200: userBody,
    },
  },
};

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = await checkUser(request.headers.authorization);

  if (!user) {
    reply.status(401).send({ message: 'Unauthorized' });
    return;
  }

  reply.status(200).send({
    username: user.username,
    email: user.email,
    description: user.description,
  });
}
