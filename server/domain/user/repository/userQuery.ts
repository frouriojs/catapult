import type { Prisma, User } from '@prisma/client';
import { brandedId } from 'service/brandedId';
import type { UserEntity } from '../model/userEntity';

const toUserEntity = (prismaUser: User): UserEntity => ({
  id: brandedId.user.entity.parse(prismaUser.id),
  email: prismaUser.email,
  signInName: prismaUser.signInName,
  createdTime: prismaUser.createdAt.getTime(),
});

export const userQuery = {
  findById: (tx: Prisma.TransactionClient, id: string): Promise<UserEntity> =>
    tx.user.findUniqueOrThrow({ where: { id } }).then(toUserEntity),
};
