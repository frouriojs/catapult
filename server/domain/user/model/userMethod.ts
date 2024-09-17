import type { GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { brandedId } from 'service/brandedId';
import type { JwtUser } from 'service/types';
import type { UserEntity } from './userType';

export const userMethod = {
  create: (jwtUser: JwtUser, cognitoUser: GetUserCommandOutput): UserEntity => {
    return {
      id: brandedId.user.entity.parse(jwtUser.sub),
      email: jwtUser.email,
      signInName: jwtUser['cognito:username'],
      displayName:
        cognitoUser.UserAttributes?.find((attr) => attr.Name === 'name')?.Value ??
        jwtUser['cognito:username'],
      photoUrl: cognitoUser.UserAttributes?.find((attr) => attr.Name === 'picture')?.Value,
      createdTime: Date.now(),
    };
  },
};
