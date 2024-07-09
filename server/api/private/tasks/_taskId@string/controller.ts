import { taskUseCase } from 'domain/task/useCase/taskUseCase';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: {
    validators: { body: z.object({ done: z.boolean() }) },
    handler: async ({ user, body, params }) => {
      const task = await taskUseCase.updateDone(user, {
        ...body,
        taskId: brandedId.task.maybe.parse(params.taskId),
      });

      return { status: 200, body: task };
    },
  },
  delete: async ({ user, params }) => {
    const task = await taskUseCase.delete(user, brandedId.task.maybe.parse(params.taskId));

    return { status: 200, body: task };
  },
}));
