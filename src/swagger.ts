import { SwaggerOptions } from '@fastify/swagger';

const swaggerOpts: SwaggerOptions = {
  routePrefix: '/doc',
  openapi: {
    info: {
      title: 'Wallpaper changer api',
      description: 'api documentation',
      version: '0.1.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        clientToken: {
          type: 'apiKey',
          name: 'api-key',
          in: 'header',
        },
      },
    },
  },

  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: header => header,
  exposeRoute: true,
};
export default swaggerOpts;
