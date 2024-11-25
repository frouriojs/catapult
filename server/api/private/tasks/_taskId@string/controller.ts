import { brandedId } from 'common/validators/brandedId';
import { taskUseCase } from 'domain/task/taskUseCase';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: {
    validators: { body: z.object({ done: z.boolean() }) },
    handler: async ({ user, body, params }) => ({
      status: 200,
      body: await taskUseCase.update(user, {
        ...body,
        taskId: brandedId.task.maybe.parse(params.taskId),
      }),
    }),
  },
  delete: async ({ user, params }) => {
    const task = await taskUseCase.delete(user, {
      taskId: brandedId.task.maybe.parse(params.taskId),
    });

    return { status: 200, body: task };
  },
}));
