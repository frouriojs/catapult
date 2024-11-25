import { taskValidator } from 'common/validators/task';
import { taskQuery } from 'domain/task/store/taskQuery';
import { taskUseCase } from 'domain/task/taskUseCase';
import { prismaClient } from 'service/prismaClient';
import { z } from 'zod';
import { defineController, multipartFileValidator } from './$relay';

export default defineController(() => ({
  get: {
    validators: { query: taskValidator.listQuery },
    handler: async ({ user, query }) => ({
      status: 200,
      body: await taskQuery.listByAuthorId(prismaClient, user, query),
    }),
  },
  post: {
    validators: {
      body: taskValidator.createBodyBase.and(
        z.object({ image: multipartFileValidator().optional() }),
      ),
    },
    handler: async ({ user, body }) => ({
      status: 200,
      body: await taskUseCase.create(user, body),
    }),
  },
  patch: {
    validators: { body: taskValidator.updateBody },
    handler: async ({ user, body }) => ({
      status: 200,
      body: await taskUseCase.update(user, body),
    }),
  },
  delete: {
    validators: { body: taskValidator.deleteBody },
    handler: async ({ user, body }) => ({
      status: 200,
      body: await taskUseCase.delete(user, body),
    }),
  },
}));
