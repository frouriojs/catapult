import assert from 'assert';
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
      const user = await userQuery.findById(prismaClient, jwtUser.sub).catch(() => null);

      if (user !== null) return user;

      const cognitoUser = await cognito.getUser(accessToken);
      const newUser = userMethod.create(jwtUser, cognitoUser);

      return await userCommand.save(tx, newUser);
    }),
  confirmEmail: (user: UserDto, accessToken: string, code: string): Promise<UserDto> =>
    transaction('RepeatableRead', async (tx) => {
      await cognito.verifyEmail({ accessToken, code });

      const cognitoUser = await cognito.getUser(accessToken);
      const emailAttr = cognitoUser.UserAttributes?.find((attr) => attr.Name === 'email');

      assert(emailAttr?.Value);

      const confirmedUser = userMethod.updateEmail(user, emailAttr.Value);

      return await userCommand.save(tx, confirmedUser);
    }),
};
