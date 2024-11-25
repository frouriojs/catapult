import type { Prisma } from '@prisma/client';
import type { MaybeId } from 'common/types/brandedId';
import type { TaskDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import type { ListTaskQuery } from 'common/validators/task';
import { depend } from 'velona';
import { TASK_INCLUDE, toTaskDto } from './toTaskDto';

const listByAuthorId = async (
  tx: Prisma.TransactionClient,
  user: UserDto,
  query?: ListTaskQuery,
): Promise<TaskDto[]> => {
  return await tx.task
    .findMany({
      where: { authorId: user.id },
      take: query?.limit,
      orderBy: { createdAt: 'desc' },
      include: TASK_INCLUDE,
    })
    .then((tasks) => tasks.map((task) => toTaskDto(user, task)));
};

export const taskQuery = {
  listByAuthorId,
  findManyWithDI: depend(
    { listByAuthorId },
    (deps, tx: Prisma.TransactionClient, user: UserDto): Promise<TaskDto[]> =>
      deps.listByAuthorId(tx, user),
  ),
  findById: async (
    tx: Prisma.TransactionClient,
    user: UserDto,
    taskId: MaybeId['task'],
  ): Promise<TaskDto> =>
    tx.task
      .findUniqueOrThrow({ where: { id: taskId }, include: TASK_INCLUDE })
      .then((task) => toTaskDto(user, task)),
};
