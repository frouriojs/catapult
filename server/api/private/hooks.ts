import type { UserDto } from 'common/types/user';
import { userUseCase } from 'domain/user/useCase/userUseCase';
import type { JwtUser } from 'service/types';
import { defineHooks } from './$relay';

export type AdditionalRequest = { user: UserDto };

export default defineHooks(() => ({
  onRequest: async (req, res) => {
    req.user = await req
      .jwtVerify<JwtUser>({ onlyCookie: true })
      .then(userUseCase.findOrCreateUser)
      .catch((e) => res.status(401).send((e as Error).message));
  },
}));
