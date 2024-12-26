import { expect, test } from 'vitest';
import { createCognitoUser, createUserClient, noCookieClient } from '../apiClient';
import { DELETE, GET, PATCH, POST } from '../utils';

test(GET(noCookieClient.private.tasks), async () => {
  const apiClient = await createCognitoUser().then(createUserClient);
  const res = await apiClient.private.tasks.get();

  expect(res.status).toEqual(200);
});

test(POST(noCookieClient.private.tasks), async () => {
  const apiClient = await createCognitoUser().then(createUserClient);
  const res = await apiClient.private.tasks.post({ body: { label: 'a' } });

  expect(res.status).toEqual(200);
});

test(PATCH(noCookieClient.private.tasks), async () => {
  const apiClient = await createCognitoUser().then(createUserClient);
  const task = await apiClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.private.tasks.patch({ body: { taskId: task.id, done: true } });

  expect(res.status).toEqual(200);
});

test(DELETE(noCookieClient.private.tasks), async () => {
  const apiClient = await createCognitoUser().then(createUserClient);
  const task = await apiClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.private.tasks.delete({ body: { taskId: task.id } });

  expect(res.status).toEqual(200);
});

test(PATCH(noCookieClient.private.tasks._taskId('_taskId')), async () => {
  const apiClient = await createCognitoUser().then(createUserClient);
  const task = await apiClient.private.tasks.$post({
    body: { label: 'a', image: new File([new Blob([])], 'aa.png') },
  });
  const res = await apiClient.private.tasks._taskId(task.id).patch({ body: { done: true } });

  expect(res.status).toEqual(200);
});

test(DELETE(noCookieClient.private.tasks._taskId('_taskId')), async () => {
  const apiClient = await createCognitoUser().then(createUserClient);
  const task = await apiClient.private.tasks.$post({ body: { label: 'a' } });
  const res = await apiClient.private.tasks._taskId(task.id).delete();

  expect(res.status).toEqual(200);

  const task2 = await apiClient.private.tasks.$post({
    body: { label: 'b', image: new File([new Blob([])], 'aa.png') },
  });
  const res2 = await apiClient.private.tasks._taskId(task2.id).delete();

  expect(res2.status === 200).toBeTruthy();
});
