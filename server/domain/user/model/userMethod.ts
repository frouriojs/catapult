import type { GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import { brandedId } from 'service/brandedId';
import type { JwtUser } from 'service/types';
import type { UserEntity } from './userType';

export const userMethod = {
  create: (jwtUser: JwtUser, cognitoUser: GetUserCommandOutput): UserEntity => {
    const attributes = cognitoUser.UserAttributes;

    assert(attributes);

    return {
      id: brandedId.user.entity.parse(jwtUser.sub),
      email: jwtUser.email,
      signInName: jwtUser['cognito:username'],
      displayName:
        attributes.find((attr) => attr.Name === 'name')?.Value ?? jwtUser['cognito:username'],
      photoUrl: attributes.find((attr) => attr.Name === 'picture')?.Value,
      createdTime: Date.now(),
    };
  },
};
