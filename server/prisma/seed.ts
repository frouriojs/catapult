import type { Prisma } from '@prisma/client';
import { prismaClient, transaction } from 'service/prismaClient';

const someFn = async (tx: Prisma.TransactionClient): Promise<void> => {
  // seeder script
  const users = await tx.user.findMany({ where: { displayName: null } });

  if (users.length > 0) {
    await Promise.all(
      users.map((user) =>
        tx.user.update({ where: { id: user.id }, data: { displayName: user.signInName } }),
      ),
    );
  }
};

transaction('RepeatableRead', (tx) => Promise.all([someFn(tx)]))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
