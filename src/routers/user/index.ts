import { FastifyInstance } from 'fastify';
import { registerHandler, registerOptions } from './register';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} _options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function UserRoutes(fastify: FastifyInstance, _options) {
  fastify.post('/', registerOptions, registerHandler);
}
