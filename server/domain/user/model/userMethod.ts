import type { GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import type { UserDto } from 'common/types/user';
import { brandedId } from 'common/validators/brandedId';
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
  checkDiff: (
    user: UserDto,
    jwtUser: JwtUser,
    cognitoUser: GetUserCommandOutput,
  ): UserEntity | null => {
    const attributes = cognitoUser.UserAttributes;

    assert(attributes);

    const email = jwtUser.email;
    const signInName = jwtUser['cognito:username'];
    const displayName =
      attributes.find((attr) => attr.Name === 'name')?.Value ?? jwtUser['cognito:username'];
    const photoUrl = attributes.find((attr) => attr.Name === 'picture')?.Value;

    if (
      [
        user.email === email,
        user.signInName === signInName,
        user.displayName === displayName,
        user.photoUrl === photoUrl,
      ].every(Boolean)
    ) {
      return null;
    }

    return {
      ...user,
      id: brandedId.user.entity.parse(user.id),
      email,
      signInName,
      displayName,
      photoUrl,
    };
  },
};
