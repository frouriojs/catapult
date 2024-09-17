import cookie from '@fastify/cookie';
import fastifyEtag from '@fastify/etag';
import helmet from '@fastify/helmet';
import fastifyHttpProxy from '@fastify/http-proxy';
import type { TokenOrHeader } from '@fastify/jwt';
import fastifyJwt from '@fastify/jwt';
import assert from 'assert';
import { IS_PROD } from 'common/constants';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import buildGetJwks from 'get-jwks';
import server from '../$server';
import { COOKIE_NAMES } from './constants';
import { CustomError } from './customAssert';
import {
  API_BASE_PATH,
  COGNITO_POOL_ENDPOINT,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  SERVER_PORT,
} from './envValues';

export const init = (): FastifyInstance => {
  const fastify = Fastify();
  const getJwks = buildGetJwks();

  fastify.register(helmet);
  fastify.register(fastifyEtag, { weak: true });
  fastify.register(cookie);

  fastify.register(fastifyJwt, {
    cookie: { cookieName: COOKIE_NAMES.idToken, signed: false },
    decode: { complete: true },
    secret: (_: FastifyRequest, token: TokenOrHeader) => {
      assert('header' in token);
      assert(token.payload.aud === COGNITO_USER_POOL_CLIENT_ID);

      const domain = `${COGNITO_POOL_ENDPOINT}/${COGNITO_USER_POOL_ID}`;

      return getJwks.getPublicKey({ kid: token.header.kid, domain, alg: token.header.alg });
    },
  });

  if (IS_PROD) {
    fastify.register(fastifyHttpProxy, {
      upstream: `http://localhost:${SERVER_PORT + 1}`,
      replyOptions: {
        rewriteHeaders: (headers) => ({ ...headers, 'content-security-policy': undefined }),
      },
    });
  }

  fastify.setErrorHandler((err, req, reply) => {
    console.error(new Date(), err.stack);

    reply
      .status(req.method === 'GET' ? 404 : 403)
      .send(err instanceof CustomError ? err.message : undefined);
  });

  server(fastify, { basePath: API_BASE_PATH });

  return fastify;
};
