import type { Prisma } from '@prisma/client';
import { prismaClient, transaction } from 'service/prismaClient';

const someFn = async (_tx: Prisma.TransactionClient): Promise<void> => {
  // seeder script
};

transaction('RepeatableRead', (tx) => Promise.all([someFn(tx)]))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
