import { taskQuery } from 'domain/task/repository/taskQuery';
import { taskValidator } from 'domain/task/service/taskValidator';
import { taskUseCase } from 'domain/task/useCase/taskUseCase';
import { brandedId } from 'service/brandedId';
import { prismaClient } from 'service/prismaClient';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ user, query }) => ({
    status: 200,
    body: await taskQuery.listByAuthorId(prismaClient, user.id, query?.limit),
  }),
  post: {
    validators: { body: taskValidator.taskCreate },
    handler: async ({ user, body }) => ({
      status: 201,
      body: await taskUseCase.create(user, body),
    }),
  },
  patch: {
    validators: { body: taskValidator.taskUpdate },
    handler: async ({ user, body }) => {
      const task = await taskUseCase.update(user, body);

      return { status: 204, body: task };
    },
  },
  delete: {
    validators: { body: z.object({ taskId: brandedId.task.maybe }) },
    handler: async ({ user, body }) => {
      const task = await taskUseCase.delete(user, body.taskId);

      return { status: 204, body: task };
    },
  },
}));
