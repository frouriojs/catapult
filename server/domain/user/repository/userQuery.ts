import type { Prisma } from '@prisma/client';
import type { UserDto } from 'common/types/user';
import { toUserDto } from './toUserDto';

export const userQuery = {
  findById: (tx: Prisma.TransactionClient, id: string): Promise<UserDto> =>
    tx.user.findUniqueOrThrow({ where: { id } }).then(toUserDto),
};
