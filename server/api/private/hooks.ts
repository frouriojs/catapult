import assert from 'assert';
import type { UserDto } from 'common/types/user';
import { userUseCase } from 'domain/user/useCase/userUseCase';
import { COOKIE_NAMES } from 'service/constants';
import type { JwtUser } from 'service/types';
import { defineHooks } from './$relay';

export type AdditionalRequest = { user: UserDto };

export default defineHooks(() => ({
  onRequest: async (req, res) => {
    req.user = await req
      .jwtVerify<JwtUser>({ onlyCookie: true })
      .then((jwtUser) => {
        const token = req.cookies[COOKIE_NAMES.accessToken];
        assert(token);

        return userUseCase.findOrCreateUser(jwtUser, token);
      })
      .catch((e) => res.status(401).send((e as Error).message));
  },
}));
