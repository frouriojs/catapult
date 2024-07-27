import type { MaybeId } from 'common/types/brandedId';
import type { TaskDto, TaskUpdateDoneDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import { transaction } from 'service/prismaClient';
import { taskEvent } from '../event/taskEvent';
import { taskMethod } from '../model/taskMethod';
import type { TaskCreateServerVal } from '../model/taskType';
import { taskCommand } from '../repository/taskCommand';
import { taskQuery } from '../repository/taskQuery';
import { toTaskDto } from '../service/toTaskDto';

export const taskUseCase = {
  create: (user: UserDto, val: TaskCreateServerVal): Promise<TaskDto> =>
    transaction('RepeatableRead', async (tx) => {
      const created = taskMethod.create(user, val);

      await taskCommand.save(tx, created);

      const dto = await toTaskDto(created.task);
      taskEvent.created(user, dto);

      return dto;
    }),
  updateDone: (user: UserDto, val: TaskUpdateDoneDto): Promise<TaskDto> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, val.taskId);
      const updated = await taskMethod.update(user, task, val);

      await taskCommand.save(tx, updated);

      const dto = await toTaskDto(updated.task);
      taskEvent.updated(user, dto);

      return dto;
    }),
  delete: (user: UserDto, taskId: MaybeId['task']): Promise<TaskDto> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, taskId);
      const deleted = taskMethod.delete(user, task);

      await taskCommand.delete(tx, deleted);

      const dto = await toTaskDto(deleted.task);
      taskEvent.deleted(user, dto);

      return dto;
    }),
};
