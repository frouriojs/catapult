import type { Prisma, User } from '@prisma/client';
import type { UserEntity } from 'api/@types/user';
import { brandedId } from 'service/brandedId';

const toUserEntity = (user: User): UserEntity => ({
  id: brandedId.user.entity.parse(user.id),
  email: user.email,
  displayName: user.displayName ?? undefined,
  photoURL: user.photoURL ?? undefined,
  createdTime: user.createdAt.getTime(),
});

export const userQuery = {
  findById: (tx: Prisma.TransactionClient, id: string): Promise<UserEntity> =>
    tx.user.findUniqueOrThrow({ where: { id } }).then(toUserEntity),
};
