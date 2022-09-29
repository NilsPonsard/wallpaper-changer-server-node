import { FastifyInstance } from 'fastify';
import { getHandler, getOptions } from './get';

export default async function UserRoutes(fastify: FastifyInstance, _options: object) {
  fastify.get('/', getOptions, getHandler);
}
