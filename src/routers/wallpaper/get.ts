import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { checkClientToken } from '../../client/check';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';

const wallpaperBody = Type.Object({
  username: Type.String(),
  id: Type.String(),
  title: Type.String(),
  url: Type.String(),
});

export const getOptions: RouteShorthandOptions = {
  schema: {
    tags: ['Wallpaper'],
    security: [{ clientToken: [] }],
    description: 'Get a wallpaper for the user',
    response: {
      200: wallpaperBody,
    },
  },
};

export async function getHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = await checkClientToken(`${request.headers['api-key']}`);

  if (!user) {
    reply.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .leftJoin('user.recievedWallpapers', 'wallpaper')
    .leftJoin('wallpaper.postedBy', 'postedBy')
    .where('user.id = :id', { id: user.id })
    .orderBy('wallpaper.createdAt', 'DESC')
    .getOne();

  if (result.recievedWallpapers.length === 0) {
    reply.status(404).send({ message: 'No wallpapers found' });
    return;
  }

  const wallpaper = result.recievedWallpapers[0];
  if (!wallpaper) {
    reply.status(404).send({ message: 'No wallpapers found' });
    return;
  }

  reply.status(200).send({
    username: wallpaper.postedBy.username,
    id: wallpaper.id,
    title: wallpaper.title,
    url: wallpaper.url,
  });
}
