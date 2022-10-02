import { FastifyInstance } from 'fastify';
import { getHandler, getOptions } from './get';
import { wallpaperHistoryHandler, wallpaperHistoryOptions } from './history';
import { postWallpaperHandler, postWallpaperOptions } from './post';

export default async function UserRoutes(fastify: FastifyInstance, _options: object) {
  fastify.get('/', getOptions, getHandler);
  fastify.post('/', postWallpaperOptions, postWallpaperHandler);
  fastify.get('/history', wallpaperHistoryOptions, wallpaperHistoryHandler);
}
