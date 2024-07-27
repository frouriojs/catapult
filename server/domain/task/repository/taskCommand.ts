import type { Prisma } from '@prisma/client';
import assert from 'assert';
import { s3 } from 'service/s3Client';
import type { TaskDeleteVal, TaskSaveVal } from '../model/taskType';

export const taskCommand = {
  save: async (tx: Prisma.TransactionClient, val: TaskSaveVal): Promise<void> => {
    await tx.task.upsert({
      where: { id: val.task.id },
      update: { label: val.task.label, done: val.task.done, imageKey: val.task.imageKey },
      create: {
        id: val.task.id,
        label: val.task.label,
        done: val.task.done,
        imageKey: val.task.imageKey,
        createdAt: new Date(val.task.createdTime),
        authorId: val.task.author.id,
      },
    });

    if (val.s3Params !== undefined) await s3.put(val.s3Params);
  },
  delete: async (tx: Prisma.TransactionClient, val: TaskDeleteVal): Promise<void> => {
    assert(val.deletable);

    await tx.task.delete({ where: { id: val.task.id } });

    if (val.task.imageKey !== undefined) await s3.delete(val.task.imageKey);
  },
};
