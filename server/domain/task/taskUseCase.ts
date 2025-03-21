import type { TaskDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import type { DeleteTaskBody, UpdateTaskBody } from 'common/validators/task';
import { transaction } from 'service/prismaClient';
import { taskMethod } from './model/taskMethod';
import type { CreateTaskPayload } from './model/taskType';
import { taskCommand } from './store/taskCommand';
import { taskQuery } from './store/taskQuery';

export const taskUseCase = {
  create: (user: UserDto, payload: CreateTaskPayload): Promise<TaskDto> =>
    transaction('RepeatableRead', async (tx) => {
      const created = taskMethod.create(user, payload);

      return await taskCommand.save(tx, user, created, payload.image);
    }),
  update: (user: UserDto, body: UpdateTaskBody): Promise<TaskDto> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, user, body.taskId);
      const updated = taskMethod.update(user, task, body);

      return await taskCommand.save(tx, user, updated);
    }),
  delete: (user: UserDto, body: DeleteTaskBody): Promise<TaskDto> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, user, body.taskId);
      const deleted = taskMethod.delete(user, task);

      return await taskCommand.delete(tx, user, deleted);
    }),
};
