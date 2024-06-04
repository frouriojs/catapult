import server from '$server';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance, FastifyServerFactory } from 'fastify';
import Fastify from 'fastify';
import { join } from 'path';
import { API_BASE_PATH } from 'service/envValues';

export const init = (serverFactory?: FastifyServerFactory): FastifyInstance => {
  const fastify = Fastify({ serverFactory, ignoreTrailingSlash: true });

  fastify.register(helmet);
  fastify.register(cookie);
  fastify.register(fastifyStatic, {
    root: join(process.cwd(), '../client/out'),
    setHeaders: (res) => res.setHeader('content-security-policy', undefined),
  });
  server(fastify, { basePath: API_BASE_PATH });

  return fastify;
};
