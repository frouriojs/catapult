import type { UserEntity } from 'api/@types/user';
import { brandedId } from 'service/brandedId';
import type { JwtUser } from 'service/types';

export const userMethod = {
  create: (jwtUser: JwtUser): UserEntity => ({
    id: brandedId.user.entity.parse(jwtUser.sub),
    email: jwtUser.email,
    signInName: jwtUser['cognito:username'],
    createdTime: Date.now(),
  }),
};
