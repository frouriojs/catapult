import assert from 'assert';
import type { TaskDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import { brandedId } from 'common/validators/brandedId';
import type { UpdateTaskBody } from 'common/validators/task';
import { ulid } from 'ulid';
import type { CreateTaskPayload, TaskEntity } from './taskType';

export const taskMethod = {
  create: (user: UserDto, payload: CreateTaskPayload): TaskEntity => {
    return {
      id: brandedId.task.entity.parse(ulid()),
      done: false,
      label: payload.label,
      imageKey:
        payload.image && `tasks/images/${ulid()}.${payload.image.filename.split('.').at(-1)}`,
      createdTime: Date.now(),
      author: { id: brandedId.user.dto.parse(user.id), signInName: user.signInName },
    };
  },
  update: (user: UserDto, task: TaskDto, body: UpdateTaskBody): TaskEntity => {
    assert(user.id === task.author.id);

    return {
      ...task,
      ...body,
      id: brandedId.task.entity.parse(task.id),
      imageKey: task.image?.s3Key,
    };
  },
  delete: (user: UserDto, task: TaskDto): TaskEntity => {
    assert(user.id === task.author.id);

    return { ...task, id: brandedId.task.entity.parse(task.id), imageKey: task.image?.s3Key };
  },
};
