import type { UserDto } from 'common/types/user';
import { cognito } from 'service/cognito';
import { prismaClient, transaction } from 'service/prismaClient';
import type { JwtUser } from 'service/types';
import { userMethod } from './model/userMethod';
import { userCommand } from './store/userCommand';
import { userQuery } from './store/userQuery';

export const userUseCase = {
  findOrCreateUser: (jwtUser: JwtUser, accessToken: string): Promise<UserDto> =>
    transaction('RepeatableRead', async (tx) => {
      const [user, cognitoUser] = await Promise.all([
        userQuery.findById(prismaClient, jwtUser.sub).catch(() => null),
        cognito.getUser(accessToken).catch((e) => e.message),
      ]);

      if (user === null) {
        const newUser = userMethod.create(jwtUser, cognitoUser);

        return await userCommand.save(tx, newUser);
      }

      const updated = userMethod.checkDiff(user, jwtUser, cognitoUser);

      if (updated) await userCommand.save(tx, updated);

      return user;
    }),
};
