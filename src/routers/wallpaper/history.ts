import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { checkUser } from '../../jwt/check';
import { messageResponse } from '../common';
import { FriendRequest, FriendRequestStatus } from '../../entities/friendRequest';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import { Wallpaper } from '../../entities/wallpaper';

const sentWallpaper = Type.Object({
  id: Type.Number(),
  url: Type.String(),
  title: Type.String(),
  target: Type.Array(Type.String()),
  likedBy: Type.Array(Type.String()),
});

const receivedWallpaper = Type.Object({
  id: Type.Number(),
  url: Type.String(),
  title: Type.String(),
  from: Type.String(),
  likedByMe: Type.Boolean(),
});

type SentWallpaperType = Static<typeof sentWallpaper>;
type ReceivedWallpaperType = Static<typeof receivedWallpaper>;

const body = Type.Object({
  received: Type.Array(receivedWallpaper),
  sent: Type.Array(sentWallpaper),
});

export const wallpaperHistoryOptions: RouteShorthandOptions = {
  schema: {
    tags: ['Wallpaper'],
    description: 'Get wallpaper history',
    security: [{ jwt: [] }],
    response: {
      200: body,
    },
  },
};

export async function wallpaperHistoryHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = await checkUser(request.headers.authorization);
  if (!user) {
    reply.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const userDetails = await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.postedWallpapers', 'postedWallpapers')
    .leftJoinAndSelect('user.receivedWallpapers', 'receivedwallpapers')
    .leftJoinAndSelect('user.likedWallpapers', 'likedwallpapers')
    .leftJoinAndSelect('postedWallpapers.postedTo', 'target')
    .leftJoinAndSelect('receivedwallpapers.postedBy', 'from')
    .leftJoinAndSelect('postedWallpapers.likedBy', 'likedby')
    .where('user.id = :id', { id: user.id })
    .getOne();

  const sentWallpapers: SentWallpaperType[] = userDetails.postedWallpapers.map(wallpaper => {
    return {
      id: wallpaper.id,
      url: wallpaper.url,
      title: wallpaper.title,
      target: wallpaper.postedTo.map(user => user.username),
      likedBy: wallpaper.likedBy.map(user => user.username),
    };
  });

  const receivedWallpapers: ReceivedWallpaperType[] = userDetails.receivedWallpapers.map(wallpaper => {
    return {
      id: wallpaper.id,
      url: wallpaper.url,
      title: wallpaper.title,
      from: wallpaper.postedBy.username,
      likedByMe: wallpaper.likedBy.some(user => user.id === user.id),
    };
  });

  reply.status(200).send({ received: receivedWallpapers, sent: sentWallpapers });
}
