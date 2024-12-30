import type { Prisma } from '@prisma/client';
import controller from 'api/private/tasks/di/controller';
import type { TaskDto } from 'common/types/task';
import type { UserDto } from 'common/types/user';
import { brandedId } from 'common/validators/brandedId';
import fastify from 'fastify';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';
import { TEST_USERNAME_PREFIX } from '../utils';

test('Dependency Injection', async () => {
  const user: UserDto = {
    id: brandedId.user.dto.parse(ulid()),
    signInName: `${TEST_USERNAME_PREFIX}-${ulid()}`,
    displayName: 'dummy-name',
    email: 'aa@example.com',
    photoUrl: 'https://example.com/user.png',
    createdTime: Date.now(),
  };
  const accessToken = ulid();
  const res1 = await controller(fastify()).get({ user, accessToken });

  expect(res1.body).toHaveLength(0);

  const mockedFindManyTask = async (
    _: Prisma.TransactionClient,
    author: UserDto,
  ): Promise<TaskDto[]> => [
    {
      id: brandedId.task.dto.parse(ulid()),
      label: 'baz',
      done: false,
      image: undefined,
      createdTime: Date.now(),
      author: { id: author.id, signInName: user.signInName },
    },
  ];

  const res2 = await controller
    .inject({ listByAuthorId: mockedFindManyTask })(fastify())
    .get({ user, accessToken });

  expect(res2.body).toHaveLength(1);
});
