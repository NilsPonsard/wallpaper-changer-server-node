import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { User } from '../../entities/user';
import { newTokenPair } from '../../jwt/generate';
import { tokenPairResponse, tokenPairResponseType } from './schemas';
import { Static, Type } from '@sinclair/typebox';
import { encryptPassword } from './password';

const registerBody = Type.Object({
  email: Type.String(),
  username: Type.String(),
  password: Type.String(),
  description: Type.String(),
});

type BodyType = Static<typeof registerBody>;

export const registerOptions: RouteShorthandOptions = {
  schema: {
    description: 'Register a new user',
    body: registerBody,
    response: {
      201: tokenPairResponse,
    },
  },
};

export async function registerHandler(
  request: FastifyRequest<{ Body: BodyType; Reply: tokenPairResponseType }>,
  reply: FastifyReply,
) {
  let user = new User();
  user.email = request.body.email;
  user.username = request.body.username;
  user.password = await encryptPassword(request.body.password);
  user.description = request.body.description;

  user = await user.save();

  reply.status(201).send(await newTokenPair(user));
}
