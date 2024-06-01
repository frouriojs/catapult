import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';
import type { UserEntity } from 'api/@types/user';
import controller from 'api/private/tasks/di/controller';
import fastify from 'fastify';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test('Dependency Injection', async () => {
  const res1 = await controller(fastify()).get({
    user: { id: 'dummy-userId' } as UserEntity,
  });

  expect(res1.body).toHaveLength(0);

  const mockedFindManyTask = async (
    _: Prisma.TransactionClient,
    authorId: EntityId['user'],
  ): Promise<TaskEntity[]> => [
    {
      id: brandedId.task.entity.parse(ulid()),
      label: 'baz',
      done: false,
      image: undefined,
      createdTime: Date.now(),
      author: { id: authorId, displayName: undefined },
    },
  ];

  const res2 = await controller
    .inject({ listByAuthorId: mockedFindManyTask })(fastify())
    .get({ user: { id: 'dummy-userId' } as UserEntity });

  expect(res2.body).toHaveLength(1);
});
