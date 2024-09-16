import type { Prisma } from '@prisma/client';
import controller from 'api/private/tasks/di/controller';
import type { DtoId } from 'common/types/brandedId';
import type { UserDto } from 'common/types/user';
import type { TaskEntity } from 'domain/task/model/taskType';
import fastify from 'fastify';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test('Dependency Injection', async () => {
  const user: UserDto = {
    id: brandedId.user.dto.parse(ulid()),
    signInName: 'dummy-user',
    displayName: 'dummy-name',
    email: 'aa@example.com',
    photoUrl: 'https://example.com/user.png',
    createdTime: Date.now(),
  };
  const res1 = await controller(fastify()).get({ user });

  expect(res1.body).toHaveLength(0);

  const mockedFindManyTask = async (
    _: Prisma.TransactionClient,
    authorId: DtoId['user'],
  ): Promise<TaskEntity[]> => [
    {
      id: brandedId.task.entity.parse(ulid()),
      label: 'baz',
      done: false,
      imageKey: undefined,
      createdTime: Date.now(),
      author: { id: brandedId.user.entity.parse(authorId), signInName: user.signInName },
    },
  ];

  const res2 = await controller
    .inject({ listByAuthorId: mockedFindManyTask })(fastify())
    .get({ user });

  expect(res2.body).toHaveLength(1);
});
