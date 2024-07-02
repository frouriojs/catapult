import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from '../apiClient';
import { DELETE, GET, PATCH, POST } from '../utils';

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
