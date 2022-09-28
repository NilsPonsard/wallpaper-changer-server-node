import { SwaggerOptions } from '@fastify/swagger';

const swaggerOpts: SwaggerOptions = {
  routePrefix: '/doc',
  swagger: {
    info: {
      title: 'Wallpaper changer api',
      description: 'api documentation',
      version: '0.1.0',
    },

    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
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
