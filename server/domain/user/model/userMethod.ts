import { brandedId } from 'service/brandedId';
import type { JwtUser } from 'service/types';
import type { UserEntity } from './userType';

export const userMethod = {
  create: (jwtUser: JwtUser): UserEntity => ({
    id: brandedId.user.entity.parse(jwtUser.sub),
    email: jwtUser.email,
    signInName: jwtUser['cognito:username'],
    createdTime: Date.now(),
  }),
};
