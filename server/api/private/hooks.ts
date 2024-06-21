import type { UserEntity } from 'api/@types/user';
import assert from 'assert';
import { userUseCase } from 'domain/user/useCase/userUseCase';
import type { JWT_PROP_NAME } from 'service/constants';
import type { JwtUser } from 'service/types';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  [Key in typeof JWT_PROP_NAME]: JwtUser;
} & { user: UserEntity };

export default defineHooks(() => ({
  onRequest: async (req, res) => {
    try {
      await req.jwtVerify({ onlyCookie: true });
    } catch (e) {
      res.status(401).send((e as Error).message);
      return;
    }

    assert(req.jwtUser);

    req.user = await userUseCase.findOrCreateUser(req.jwtUser);
  },
}));
