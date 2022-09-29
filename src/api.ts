import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import swaggerOpts from './swagger';
import UserRoutes from './routers/user';

const routers = [{ router: UserRoutes, prefix: '/user' }];

export async function serve() {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(fastifySwagger, swaggerOpts);

  await Promise.all(routers.map(({ router, prefix }) => fastify.register(router, { prefix })));

  await fastify.listen({ port: 3000 });
}
