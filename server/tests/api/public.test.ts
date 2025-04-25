import { COOKIE_NAMES } from 'service/constants';
import { expect, test } from 'vitest';
import { createCognitoUser, createUserClient, noCookieClient } from './apiClient';
import { GET, POST } from './utils';

test(GET(noCookieClient), async () => {
  const res = await noCookieClient.$get();

  expect(res).toEqual('');
});

test(GET(noCookieClient.health), async () => {
  const res = await noCookieClient.health.$get();

  expect(res).toEqual('ok');
});

test(POST(noCookieClient.session), async () => {
  const tokens = await createCognitoUser();
  const res1 = await noCookieClient.session.post({ body: tokens });

  expect(
    res1.headers['set-cookie']![0]!.startsWith(`${COOKIE_NAMES.idToken}=${tokens.idToken};`),
  ).toBeTruthy();
  expect(
    res1.headers['set-cookie']![1]!.startsWith(
      `${COOKIE_NAMES.accessToken}=${tokens.accessToken};`,
    ),
  ).toBeTruthy();
  expect(res1.body.status).toBe('success');

  const res2 = await createUserClient(tokens).session.delete();

  expect(res2.headers['set-cookie']![0]!.startsWith(`${COOKIE_NAMES.idToken}=;`)).toBeTruthy();
  expect(res2.headers['set-cookie']![1]!.startsWith(`${COOKIE_NAMES.accessToken}=;`)).toBeTruthy();
  expect(res2.body.status).toBe('success');
});
