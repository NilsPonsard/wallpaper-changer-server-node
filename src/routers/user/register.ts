import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

export const registerOptions: RouteShorthandOptions = {
  schema: {
    description: 'post some data',
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['email', 'username', 'password', 'description'],
    },
    response: {
      201: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
    },
  },
};

export function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  request.body;
}
