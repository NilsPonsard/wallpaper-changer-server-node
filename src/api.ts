import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import cors from '@fastify/cors';
import swaggerOpts from './swagger';
import UserRoutes from './routers/user';
import WallpaperRoutes from './routers/wallpaper';

const routers = [
  { router: UserRoutes, prefix: '/user' },
  { router: WallpaperRoutes, prefix: '/wallpaper' },
];

export async function serve() {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(fastifySwagger, swaggerOpts);
  await fastify.register(cors, { origin: '*' });

  await Promise.all(routers.map(({ router, prefix }) => fastify.register(router, { prefix })));

  await fastify.listen({ port: 3000, host:"0.0.0.0" });
}
