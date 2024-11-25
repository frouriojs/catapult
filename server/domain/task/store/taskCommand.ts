import type { MultipartFile } from '@fastify/multipart';
import type { Prisma } from '@prisma/client';
import assert from 'assert';
import type { TaskDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import { s3 } from 'service/s3Client';
import type { TaskEntity } from '../model/taskType';
import { TASK_INCLUDE, toTaskDto } from './toTaskDto';

export const taskCommand = {
  save: async (
    tx: Prisma.TransactionClient,
    user: UserDto,
    task: TaskEntity,
    image?: MultipartFile,
  ): Promise<TaskDto> => {
    if (image) {
      assert(task.imageKey);

      await s3.put({ key: task.imageKey, data: image });
    }

    return await tx.task
      .upsert({
        where: { id: task.id },
        update: { label: task.label, done: task.done, imageKey: task.imageKey },
        create: {
          id: task.id,
          label: task.label,
          done: task.done,
          imageKey: task.imageKey,
          createdAt: new Date(task.createdTime),
          authorId: task.author.id,
        },
        include: TASK_INCLUDE,
      })
      .then((task) => toTaskDto(user, task));
  },
  delete: async (
    tx: Prisma.TransactionClient,
    user: UserDto,
    task: TaskEntity,
  ): Promise<TaskDto> => {
    if (task.imageKey !== undefined) await s3.delete(task.imageKey);

    return await tx.task
      .delete({ where: { id: task.id }, include: TASK_INCLUDE })
      .then((task) => toTaskDto(user, task));
  },
};
