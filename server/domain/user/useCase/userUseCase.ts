import type { UserDto } from 'common/types/user';
import { cognito } from 'service/cognito';
import { prismaClient, transaction } from 'service/prismaClient';
import type { JwtUser } from 'service/types';
import { userMethod } from '../model/userMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';

export const userUseCase = {
  findOrCreateUser: (jwtUser: JwtUser, accessToken: string): Promise<UserDto> =>
    transaction('RepeatableRead', async (tx) => {
      const user = await userQuery.findById(prismaClient, jwtUser.sub).catch(() => null);

      if (user !== null) return user;

      const cognitoUser = await cognito.getUser(accessToken).catch((e) => e.message);
      const newUser = userMethod.create(jwtUser, cognitoUser);

      return await userCommand.save(tx, newUser);
    }),
};
