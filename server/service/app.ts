import cookie from '@fastify/cookie';
import fastifyEtag from '@fastify/etag';
import helmet from '@fastify/helmet';
import type { TokenOrHeader } from '@fastify/jwt';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import assert from 'assert';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import buildGetJwks from 'get-jwks';
import { join } from 'path';
import server from '../$server';
import { COOKIE_NAME, JWT_PROP_NAME } from './constants';
import {
  API_BASE_PATH,
  COGNITO_POOL_ENDPOINT,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from './envValues';

export const init = (): FastifyInstance => {
  const fastify = Fastify();
  const getJwks = buildGetJwks();

  fastify.register(helmet);
  fastify.register(fastifyEtag, { weak: true });
  fastify.register(cookie);
  fastify.register(fastifyJwt, {
    decoratorName: JWT_PROP_NAME,
    cookie: { cookieName: COOKIE_NAME, signed: false },
    decode: { complete: true },
    secret: (_: FastifyRequest, token: TokenOrHeader) => {
      assert('header' in token, '不正リクエスト防御');
      assert(token.payload.aud === COGNITO_USER_POOL_CLIENT_ID, '不正リクエスト防御');

      const domain = `${COGNITO_POOL_ENDPOINT}/${COGNITO_USER_POOL_ID}`;

      return getJwks.getPublicKey({ kid: token.header.kid, domain, alg: token.header.alg });
    },
  });
  fastify.register(fastifyStatic, {
    root: join(process.cwd(), '../client/out'),
    setHeaders: (res) => res.setHeader('content-security-policy', undefined),
  });

  server(fastify, { basePath: API_BASE_PATH });

  return fastify;
};
