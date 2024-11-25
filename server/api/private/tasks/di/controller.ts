import { taskQuery } from 'domain/task/store/taskQuery';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController({ listByAuthorId: taskQuery.listByAuthorId }, (deps) => ({
  get: async ({ user }) => ({
    status: 200,
    body: await taskQuery.findManyWithDI.inject(deps)(prismaClient, user),
  }),
}));
