import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import swaggerOpts from './swagger';
import UserRoutes from './routers/user';

const routers = [{ router: UserRoutes, prefix: '/user' }];

export async function serve() {
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(fastifySwagger, swaggerOpts);

  await Promise.all(routers.map(({ router, prefix }) => fastify.register(router, { prefix })));

  await fastify.listen({ port: 3000 });
}
