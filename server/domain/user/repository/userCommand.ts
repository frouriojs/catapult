import type { Prisma } from '@prisma/client';
import type { UserEntity } from '../model/userEntity';

export const userCommand = {
  save: async (tx: Prisma.TransactionClient, user: UserEntity): Promise<void> => {
    await tx.user.upsert({
      where: { id: user.id },
      update: { email: user.email, signInName: user.signInName },
      create: {
        id: user.id,
        email: user.email,
        signInName: user.signInName,
        createdAt: new Date(user.createdTime),
      },
    });
  },
};
