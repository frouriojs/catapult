import { taskQuery } from 'domain/task/repository/taskQuery';
import { toTaskDto } from 'domain/task/service/toTaskDto';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController({ listByAuthorId: taskQuery.listByAuthorId }, (deps) => ({
  get: async ({ user }) => ({
    status: 200,
    body: await taskQuery.findManyWithDI
      .inject(deps)(prismaClient, user.id)
      .then((tasks) => tasks.map(toTaskDto)),
  }),
}));
