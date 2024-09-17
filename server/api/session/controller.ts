import type { CookieSerializeOptions } from '@fastify/cookie';
import assert from 'assert';
import { COOKIE_NAMES } from 'service/constants';
import { z } from 'zod';
import type { Methods } from '.';
import { defineController } from './$relay';

export type AdditionalRequest = {
  body: Methods['post']['reqBody'];
};

const options: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  path: '/',
  sameSite: 'strict',
};

export default defineController((fastify) => ({
  post: {
    validators: { body: z.object({ idToken: z.string(), accessToken: z.string() }) },
    hooks: {
      preHandler: (req, reply, done) => {
        assert(req.body);

        const decoded = z
          .object({ payload: z.object({ exp: z.number() }).passthrough() })
          .passthrough()
          .parse(fastify.jwt.decode(req.body.idToken));

        reply.setCookie(COOKIE_NAMES.idToken, req.body.idToken, {
          ...options,
          expires: new Date(decoded.payload.exp * 1000),
        });

        reply.setCookie(COOKIE_NAMES.accessToken, req.body.accessToken, {
          ...options,
          expires: new Date(decoded.payload.exp * 1000),
        });

        done();
      },
    },
    handler: () => ({ status: 200, body: { status: 'success' } }),
  },
  delete: {
    hooks: {
      preHandler: (_, reply, done) => {
        reply.clearCookie(COOKIE_NAMES.idToken, options);
        reply.clearCookie(COOKIE_NAMES.accessToken, options);
        done();
      },
    },
    handler: () => ({ status: 200, body: { status: 'success' } }),
  },
}));
