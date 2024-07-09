import type { Prisma, Task, User } from '@prisma/client';
import type { DtoId, MaybeId } from 'common/types/brandedId';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import { depend } from 'velona';
import type { TaskEntity } from '../model/taskEntity';

const toEntity = async (prismaTask: Task & { Author: User }): Promise<TaskEntity> => ({
  id: brandedId.task.entity.parse(prismaTask.id),
  label: prismaTask.label,
  done: prismaTask.done,
  image:
    prismaTask.imageKey === null
      ? undefined
      : { url: await s3.getSignedUrl(prismaTask.imageKey), s3Key: prismaTask.imageKey },
  author: {
    id: brandedId.user.entity.parse(prismaTask.authorId),
    signInName: prismaTask.Author.signInName,
  },
  createdTime: prismaTask.createdAt.getTime(),
});

const listByAuthorId = async (
  tx: Prisma.TransactionClient,
  authorId: DtoId['user'],
  limit?: number,
): Promise<TaskEntity[]> => {
  const prismaTasks = await tx.task.findMany({
    where: { authorId },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { Author: true },
  });

  return Promise.all(prismaTasks.map(toEntity));
};

export const taskQuery = {
  listByAuthorId,
  findManyWithDI: depend(
    { listByAuthorId },
    (deps, tx: Prisma.TransactionClient, userId: DtoId['user']): Promise<TaskEntity[]> =>
      deps.listByAuthorId(tx, userId),
  ),
  findById: async (tx: Prisma.TransactionClient, taskId: MaybeId['task']): Promise<TaskEntity> =>
    tx.task.findUniqueOrThrow({ where: { id: taskId }, include: { Author: true } }).then(toEntity),
};
