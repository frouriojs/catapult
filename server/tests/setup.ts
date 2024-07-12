import { exec } from 'child_process';
import type { FastifyInstance } from 'fastify';
import { init } from 'service/app';
import { prismaClient } from 'service/prismaClient';
import util from 'util';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { TEST_PORT } from './api/utils';

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

afterEach(async (info) => {
  if (unneededServer(info.task.file)) return;

  await prismaClient.$disconnect();
});

afterAll(async (info) => {
  if (unneededServer(info.file)) return;

  await server.close();
});
