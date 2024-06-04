import { COOKIE_NAME } from 'service/constants';
import { expect, test } from 'vitest';
import { apiClient, noCookieClient } from './apiClient';
import { DELETE, GET } from './utils';

test(GET(apiClient), async () => {
  const res = await apiClient.$get();

  expect(res).toEqual('');
});

test(GET(apiClient.health), async () => {
  const res = await apiClient.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
  expect(res.storage).toEqual('ok');
});

test(DELETE(apiClient.session), async () => {
  const res1 = await noCookieClient.session.delete();
  expect(res1.status).toEqual(200);

  const res2 = await apiClient.session.delete();

  expect(res2.headers['set-cookie'][0].startsWith(`${COOKIE_NAME}=;`)).toBeTruthy();
  expect(res2.body.status === 'success').toBeTruthy();
});
