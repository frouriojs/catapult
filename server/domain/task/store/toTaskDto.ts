import type { Task, User } from '@prisma/client';
import assert from 'assert';
import type { TaskDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import { brandedId } from 'common/validators/brandedId';
import { s3 } from 'service/s3Client';

export const TASK_INCLUDE = { Author: true } as const;

export const toTaskDto = (user: UserDto, prismaTask: Task & { Author: User }): TaskDto => {
  assert(user.id === prismaTask.authorId);

  return {
    id: brandedId.task.dto.parse(prismaTask.id),
    label: prismaTask.label,
    done: prismaTask.done,
    image: prismaTask.imageKey
      ? { s3Key: prismaTask.imageKey, url: s3.keyToUrl(prismaTask.imageKey) }
      : undefined,
    author: {
      id: brandedId.user.dto.parse(prismaTask.authorId),
      signInName: prismaTask.Author.signInName,
    },
    createdTime: prismaTask.createdAt.getTime(),
  };
};
