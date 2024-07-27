import assert from 'assert';
import type { TaskUpdateDoneDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import { labelValidator } from 'common/validators/task';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type { TaskCreateServerVal, TaskDeleteVal, TaskEntity, TaskSaveVal } from './taskType';

export const taskMethod = {
  create: (user: UserDto, val: TaskCreateServerVal): TaskSaveVal => {
    const task: TaskEntity = {
      id: brandedId.task.entity.parse(ulid()),
      done: false,
      label: labelValidator.parse(val.label),
      imageKey: undefined,
      createdTime: Date.now(),
      author: { id: brandedId.user.entity.parse(user.id), signInName: user.signInName },
    };

    if (val.image === undefined) return { task };

    const imageKey = `tasks/images/${ulid()}.${val.image.filename.split('.').at(-1)}`;

    return { task: { ...task, imageKey }, s3Params: { key: imageKey, data: val.image } };
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
