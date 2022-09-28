/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function UserRoutes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
}

