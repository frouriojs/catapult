import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from '../apiClient';
import { GET } from '../utils';

test(GET(noCookieClient.private), async () => {
  const { userClient, cleanUp } = await createUserClient();
  const res = await userClient.private.$get();

  expect(res).toEqual('');

  await expect(noCookieClient.private.get()).rejects.toHaveProperty('response.status', 401);
  await cleanUp();
});

test(GET(noCookieClient.private.me), async () => {
  const { userClient, cleanUp } = await createUserClient();
  const res = await userClient.private.me.get();

  expect(res.status).toEqual(200);

  await cleanUp();
});
