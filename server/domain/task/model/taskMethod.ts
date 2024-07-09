import type { TaskUpdateDoneDto } from 'api/@types/task';
import type { UserDto } from 'api/@types/user';
import { labelValidator } from 'api/@validators/task';
import assert from 'assert';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import { ulid } from 'ulid';
import type { TaskCreateServerVal, TaskDeleteVal, TaskEntity, TaskSaveVal } from './taskEntity';

export const taskMethod = {
  create: async (user: UserDto, val: TaskCreateServerVal): Promise<TaskSaveVal> => {
    const task: TaskEntity = {
      id: brandedId.task.entity.parse(ulid()),
      done: false,
      label: labelValidator.parse(val.label),
      image: undefined,
      createdTime: Date.now(),
      author: { id: brandedId.user.entity.parse(user.id), signInName: user.signInName },
    };

    if (val.image === undefined) return { task };

    const s3Key = `tasks/images/${ulid()}.${val.image.filename.split('.').at(-1)}`;
    const url = await s3.getSignedUrl(s3Key);

    return {
      task: { ...task, image: { s3Key, url } },
      s3Params: { key: s3Key, data: val.image },
    };
  },
  update: (user: UserDto, task: TaskEntity, dto: TaskUpdateDoneDto): TaskSaveVal => {
    assert(user.id === String(task.author.id));

    return { task: { ...task, ...dto } };
  },
  delete: (user: UserDto, task: TaskEntity): TaskDeleteVal => {
    assert(user.id === String(task.author.id));

    return { deletable: true, task };
  },
};
