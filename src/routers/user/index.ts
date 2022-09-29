import { FastifyInstance } from 'fastify';
import { loginHandler, loginOptions } from './login';
import { registerHandler, registerOptions } from './register';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} _options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function UserRoutes(fastify: FastifyInstance, _options: object) {
  fastify.post('/', registerOptions, registerHandler);
  fastify.post('/login', loginOptions, loginHandler);
}
