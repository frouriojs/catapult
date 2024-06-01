import { taskUseCase } from 'domain/task/useCase/taskUseCase';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: {
    validators: { body: z.object({ label: z.string().optional(), done: z.boolean().optional() }) },
    handler: async ({ user, body, params }) => {
      const task = await taskUseCase.update(user, {
        ...body,
        taskId: brandedId.task.entity.parse(params.taskId),
      });

      return { status: 204, body: task };
    },
  },
  delete: async ({ user, params }) => {
    const task = await taskUseCase.delete(user, brandedId.task.entity.parse(params.taskId));

    return { status: 204, body: task };
  },
}));
