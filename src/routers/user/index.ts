import { FastifyInstance } from 'fastify';
import { addFriendHandler, addFriendOptions } from './add_friend';
import { clientPostHandler, clientPostOptions } from './client';
import { getUserHandler, getUserOptions } from './get';
import { loginHandler, loginOptions } from './login';
import { meHandler, meOptions } from './me';
import { registerHandler, registerOptions } from './register';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} _options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function UserRoutes(fastify: FastifyInstance, _options: object) {
  fastify.post('/', registerOptions, registerHandler);
  fastify.post('/login', loginOptions, loginHandler);
  fastify.get('/me', meOptions, meHandler);
  fastify.post('/client', clientPostOptions, clientPostHandler);
  fastify.get('/:id', getUserOptions, getUserHandler);
  fastify.post('/friend/:username', addFriendOptions, addFriendHandler);
}
