import type { Prisma } from '@prisma/client';
import type { UserDto } from 'common/types/user';
import type { UserEntity } from '../model/userType';
import { toUserDto } from './toUserDto';

export const userCommand = {
  save: async (tx: Prisma.TransactionClient, user: UserEntity): Promise<UserDto> => {
    return await tx.user
      .upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          signInName: user.signInName,
          displayName: user.displayName,
          photoUrl: user.photoUrl,
        },
        create: {
          id: user.id,
          email: user.email,
          signInName: user.signInName,
          displayName: user.displayName,
          photoUrl: user.photoUrl,
          createdAt: new Date(user.createdTime),
        },
      })
      .then(toUserDto);
  },
};
