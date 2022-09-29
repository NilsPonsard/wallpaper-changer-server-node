import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { checkUser } from '../../jwt/check';
import { messageResponse } from '../common';
import { FriendRequest, FriendRequestStatus } from '../../entities/friendRequest';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import { Wallpaper } from '../../entities/wallpaper';

const body = Type.Object({
  url: Type.String(),
  title: Type.String(),
  target: Type.Array(Type.Number()),
});

type BodyType = Static<typeof body>;

export const postWallpaperOptions: RouteShorthandOptions = {
  schema: {
    tags: ['Wallpaper'],
    description: 'Send a friend request to a user, or accept a friend request from a user',
    security: [{ jwt: [] }],
    body,
    response: {
      201: messageResponse,
    },
  },
};

export async function postWallpaperHandler(request: FastifyRequest<{ Body: BodyType }>, reply: FastifyReply) {
  const user = await checkUser(request.headers.authorization);
  if (!user) {
    reply.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const { url, title, target } = request.body;

  const userDetails = await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.sentFriendRequests', 'sentFriendRequests')
    .leftJoinAndSelect('user.receivedFriendRequests', 'receivedFriendRequests')
    .leftJoinAndSelect('sentFriendRequests.to', 'to')
    .leftJoinAndSelect('receivedFriendRequests.from', 'from')
    .where('user.id = :id', { id: user.id })
    .getOne();

  let notFriend: number[] = target;

  let targets: User[] = [];

  target.forEach(id => {
    const sent = userDetails.sentFriendRequests.find(request => request.to.id === id);
    const received = userDetails.receivedFriendRequests.find(request => request.from.id === id);

    if (sent && sent.status === FriendRequestStatus.ACCEPTED) {
      targets.push(sent.to);
      notFriend = notFriend.filter(i => i !== id);
    } else if (received && received.status === FriendRequestStatus.ACCEPTED) {
      targets.push(received.from);
      notFriend = notFriend.filter(i => i !== id);
    }
  });

  if (notFriend.length > 0) {
    reply.status(400).send({ message: 'Not friend : ' + notFriend.join(',') });
    return;
  }

  const wallpaper = new Wallpaper();
  wallpaper.url = url;
  wallpaper.title = title;
  wallpaper.postedBy = user;
  wallpaper.postedTo = targets;
  wallpaper.likedBy = [];
  wallpaper.save();

  reply.status(201).send({ message: 'ok' });
}
