import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { checkUser } from '../../jwt/check';
import { newClientTokenForUser } from '../../client/token';

const clientTokenResponse = Type.Object({
  token: Type.String(),
});

export const clientPostOptions: RouteShorthandOptions = {
  schema: {
    tags: ['User', 'Client'],
    description: 'Generate a new client token for the user',
    security: [{ jwt: [] }],
    response: {
      201: clientTokenResponse,
    },
  },
};

export async function clientPostHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = await checkUser(request.headers.authorization);
  if (!user) {
    reply.status(401).send({ message: 'Unauthorized' });
    return;
  }

  reply.status(201).send({ token: await newClientTokenForUser(user) });
}
