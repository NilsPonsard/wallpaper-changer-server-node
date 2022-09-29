import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { checkUser } from '../../jwt/check';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';

const userBody = Type.Object({
  id: Type.Number(),
  username: Type.String(),
  description: Type.String(),
});

const userParams = Type.Object({
  id: Type.Number(),
});

type UserParamsType = Static<typeof userParams>;

export const getUserOptions: RouteShorthandOptions = {
  schema: {
    tags: ['User'],
    security: [{ jwt: [] }],
    description: 'Get info about user',
    params: userParams,
    response: {
      200: userBody,
    },
  },
};

export async function getUserHandler(request: FastifyRequest<{ Params: UserParamsType }>, reply: FastifyReply) {
  const user = await checkUser(request.headers.authorization);

  if (!user) {
    reply.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const targetUser = await AppDataSource.getRepository(User).findOne({
    where: { id: request.params.id },
  });

  reply.status(200).send({
    id: targetUser.id,
    username: targetUser.username,
    description: targetUser.description,
  });
}
