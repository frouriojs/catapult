import { WS_TYPES } from 'api/@constants';
import type { TaskCreated, TaskDeleted, TaskUpdated } from 'api/@types/task';
import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from '../apiClient';
import { DELETE, GET, PATCH, POST, createWsClient } from '../utils';

test(GET(noCookieClient.private.tasks), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.tasks.get();

  expect(res.status).toEqual(200);
});

test(POST(noCookieClient.private.tasks), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.tasks.post({ body: { label: 'a' } });

  expect(res.status).toEqual(201);
});

test(PATCH(noCookieClient.private.tasks), async () => {
  const userClient = await createUserClient();
  const task = await userClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await userClient.private.tasks.patch({ body: { taskId: task.id, label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(noCookieClient.private.tasks), async () => {
  const userClient = await createUserClient();
  const task = await userClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await userClient.private.tasks.delete({ body: { taskId: task.id } });

  expect(res.status).toEqual(204);
});

test(PATCH(noCookieClient.private.tasks._taskId('_taskId')), async () => {
  const userClient = await createUserClient();
  const task = await userClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await userClient.private.tasks._taskId(task.id).patch({ body: { label: 'b' } });

  expect(res.status).toEqual(204);
});

test(DELETE(noCookieClient.private.tasks._taskId('_taskId')), async () => {
  const userClient = await createUserClient();
  const task = await userClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await userClient.private.tasks._taskId(task.id).delete();

  expect(res.status).toEqual(204);

  const task2 = await userClient.private.tasks.$post({ body: { label: 'b', image: new Blob([]) } });
  const res2 = await userClient.private.tasks._taskId(task2.id).delete();

  expect(res2.status === 204).toBeTruthy();
});

test(`WS: ${WS_TYPES[0]}`, async () => {
  const ws = await createWsClient();
  const userClient = await createUserClient();

  await new Promise<void>((resolve): void => {
    const label = 'a';

    ws.on('message', async (json: string): Promise<void> => {
      const { type, task }: TaskCreated = JSON.parse(json);

      expect(type).toBe(WS_TYPES[0]);
      expect(task.label).toBe(label);
      resolve();
      ws.close();
    });

    userClient.private.tasks.post({ body: { label } });
  });
});

test(`WS: ${WS_TYPES[1]}`, async () => {
  const ws = await createWsClient();
  const userClient = await createUserClient();
  const created = await userClient.private.tasks.$post({ body: { label: 'a' } });

  await new Promise<void>((resolve): void => {
    const label = 'b';

    ws.on('message', async (json: string): Promise<void> => {
      const { type, task }: TaskUpdated = JSON.parse(json);

      expect(type).toBe(WS_TYPES[1]);
      expect(task.label).toBe(label);
      resolve();
      ws.close();
    });

    userClient.private.tasks.patch({ body: { taskId: created.id, label } });
  });
});

test(`WS: ${WS_TYPES[2]}`, async () => {
  const ws = await createWsClient();
  const userClient = await createUserClient();
  const created = await userClient.private.tasks.$post({ body: { label: 'a' } });

  await new Promise<void>((resolve): void => {
    ws.on('message', async (json: string): Promise<void> => {
      const { type, taskId }: TaskDeleted = JSON.parse(json);

      expect(type).toBe(WS_TYPES[2]);
      expect(taskId).toBe(created.id);
      resolve();
      ws.close();
    });

    userClient.private.tasks._taskId(created.id).delete();
  });
});
