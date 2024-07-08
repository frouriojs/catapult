import { expect, test } from 'vitest';
import { createSessionClients, noCookieClient } from '../apiClient';
import { GET } from '../utils';

test(GET(noCookieClient.private), async () => {
  const { apiClient } = await createSessionClients();
  const res = await apiClient.private.$get();

  expect(res).toEqual('');

  await expect(noCookieClient.private.get()).rejects.toHaveProperty('response.status', 401);
});

test(GET(noCookieClient.private.me), async () => {
  const { apiClient } = await createSessionClients();
  const res = await apiClient.private.me.get();

  expect(res.status).toEqual(200);
});
