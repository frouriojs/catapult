import assert from 'assert';
import type { UserDto } from 'common/types/user';
import { userUseCase } from 'domain/user/useCase/userUseCase';
import { COOKIE_NAMES, type JWT_PROP_NAME } from 'service/constants';
import type { JwtUser } from 'service/types';
import { defineHooks } from './$relay';

export type AdditionalRequest = { [Key in typeof JWT_PROP_NAME]?: JwtUser } & { user: UserDto };

export default defineHooks(() => ({
  onRequest: async (req, res) => {
    try {
      await req.jwtVerify({ onlyCookie: true });
    } catch (e) {
      res.status(401).send((e as Error).message);
      return;
    }

    const token = req.cookies[COOKIE_NAMES.accessToken];

    assert(token);
    assert(req.jwtUser);

    req.user = await userUseCase.findOrCreateUser(req.jwtUser, token);
  },
}));
