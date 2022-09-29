import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { checkUser } from '../../jwt/check';
import { messageResponse } from '../common';
import { userBody, userBodyType } from './schemas';
import { User } from '../../entities/user';
import { FriendRequestStatus } from '../../entities/friendRequest';

export const friendsResponse = Type.Object({
  friends: Type.Array(userBody),
  requests: Type.Array(userBody),
  sent: Type.Array(userBody),
});

export const getFriendsOptions: RouteShorthandOptions = {
  schema: {
    tags: ['User'],
    description: 'Get friends and friends requests',
    security: [{ jwt: [] }],
    response: {
      200: friendsResponse,
    },
  },
};

export async function getFriendsHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = await checkUser(request.headers.authorization);
  if (!user) {
    reply.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const extended = await User.createQueryBuilder('user')
    .leftJoinAndSelect('user.sentFriendRequests', 'sentFriendRequests')
    .leftJoinAndSelect('user.receivedFriendRequests', 'receivedFriendRequests')
    .leftJoinAndSelect('sentFriendRequests.to', 'to')
    .leftJoinAndSelect('receivedFriendRequests.from', 'from')
    .where('user.id = :id', { id: user.id })
    .getOne();

  console.log(extended);

  const friends: userBodyType[] = [];
  const requests: userBodyType[] = [];
  const sent: userBodyType[] = [];

  extended.sentFriendRequests.forEach(request => {
    switch (request.status) {
      case FriendRequestStatus.ACCEPTED:
        friends.push(request.to);
        break;
      case FriendRequestStatus.PENDING:
        sent.push(request.to);
        break;
    }
  });

  extended.receivedFriendRequests.forEach(request => {
    switch (request.status) {
      case FriendRequestStatus.ACCEPTED:
        friends.push(request.from);
        break;
      case FriendRequestStatus.PENDING:
        requests.push(request.from);
        break;
    }
  });

  reply.status(200).send({
    friends: friends,
    requests: requests,
    sent: sent,
  });
}
