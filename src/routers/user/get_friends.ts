import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { checkUser } from '../../jwt/check';
import { messageResponse } from '../common';
import { userBody } from './schemas';
import { User } from '../../entities/user';
import { FriendRequestStatus } from '../../entities/friendRequest';

export const friendsResponse = Type.Object({
  friends: Type.Array(userBody),
  requests: Type.Array(userBody),
  sent: Type.Array(userBody),
});

export type messageResponseType = Static<typeof messageResponse>;

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

  const friends: Map<string, User> = new Map();
  const requests: Map<string, User> = new Map();
  const sent: Map<string, User> = new Map();

  extended.sentFriendRequests.forEach(request => {
    switch (request.status) {
      case FriendRequestStatus.ACCEPTED:
        friends[request.to.id] = request.to;
        break;
      case FriendRequestStatus.PENDING:
        sent[request.to.id] = request.to;
        break;
      default:
        break;
    }
  });

  extended.receivedFriendRequests.forEach(request => {
    switch (request.status) {
      case FriendRequestStatus.ACCEPTED:
        friends[request.from.id] = request.from;
        break;
      case FriendRequestStatus.PENDING:
        requests[request.from.id] = request.from;
        break;
      default:
        break;
    }
  });

  reply.status(200).send({
    friends: Array.from(friends.values()),
    requests: Array.from(requests.values()),
    sent: Array.from(sent.values()),
  });
}
