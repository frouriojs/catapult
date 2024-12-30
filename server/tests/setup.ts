import {
  AdminDeleteUserCommand,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import type { FastifyInstance } from 'fastify';
import { init } from 'service/app';
import { cognitoClient } from 'service/cognito';
import { COGNITO_USER_POOL_ID, S3_BUCKET } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import { s3Client } from 'service/s3Client';
import util from 'util';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { TEST_PORT, TEST_USERNAME_PREFIX } from './api/utils';

let server: FastifyInstance;

const unneededServer = (file: { filepath: string }): boolean =>
  !/\/tests\/api\/.+\.test\.ts$/.test(file.filepath);

beforeAll(async (info) => {
  if (unneededServer(info.file)) return;

  server = init();
  await server.listen({ port: TEST_PORT, host: '0.0.0.0' });
});

beforeEach(async (info) => {
  if (unneededServer(info.task.file)) return;

  await util.promisify(exec)('npx prisma migrate reset --force');
});

const resetS3 = async (): Promise<void> => {
  const objects = await s3Client.send(new ListObjectsV2Command({ Bucket: S3_BUCKET }));
  const keys = objects.Contents?.map(({ Key }) => ({ Key })) ?? [];

  if (keys.length === 0) return;

  await s3Client.send(new DeleteObjectsCommand({ Bucket: S3_BUCKET, Delete: { Objects: keys } }));
};

const resetCognito = async (): Promise<void> => {
  const { Users } = await cognitoClient.send(
    new ListUsersCommand({ UserPoolId: COGNITO_USER_POOL_ID }),
  );

  if (!Users) return;

  const testUsers = Users.filter((u) => u.Username?.startsWith(TEST_USERNAME_PREFIX));

  for (let i = 0; ; i += 1) {
    const targets = testUsers.slice(i * 10, (i + 1) * 10);

    if (targets.length === 0) return;

    await Promise.all(
      targets.map((u) =>
        cognitoClient.send(
          new AdminDeleteUserCommand({ Username: u.Username, UserPoolId: COGNITO_USER_POOL_ID }),
        ),
      ),
    );
  }
};

afterEach(async (info) => {
  if (unneededServer(info.task.file)) return;

  await prismaClient.$disconnect();
  await resetS3();
  await resetCognito();
});

afterAll(async (info) => {
  if (unneededServer(info.file)) return;

  await server.close();
});
