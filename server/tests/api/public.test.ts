import { createSigner } from 'fast-jwt';
import { COOKIE_NAMES } from 'service/constants';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';
import { createCognitoUserClient, noCookieClient } from './apiClient';
import { DELETE, GET, POST } from './utils';

test(GET(noCookieClient), async () => {
  const apiClient = await createCognitoUserClient();
  const res = await apiClient.$get();

  expect(res).toEqual('');
});

test(GET(noCookieClient.health), async () => {
  const apiClient = await createCognitoUserClient();
  const res = await apiClient.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
  expect(res.s3).toEqual('ok');
});

test(POST(noCookieClient.session), async () => {
  const idToken = createSigner({ key: 'dummy' })({ exp: Math.floor(Date.now() / 1000) + 100 });
  const accessToken = ulid();
  const res = await noCookieClient.session.post({ body: { idToken, accessToken } });

  expect(
    res.headers['set-cookie'][0].startsWith(`${COOKIE_NAMES.idToken}=${idToken};`),
  ).toBeTruthy();
  expect(
    res.headers['set-cookie'][1].startsWith(`${COOKIE_NAMES.accessToken}=${accessToken};`),
  ).toBeTruthy();
  expect(res.body.status === 'success').toBeTruthy();
});

test(DELETE(noCookieClient.session), async () => {
  const apiClient = await createCognitoUserClient();
  const res = await apiClient.session.delete();

  expect(res.headers['set-cookie'][0].startsWith(`${COOKIE_NAMES.idToken}=;`)).toBeTruthy();
  expect(res.headers['set-cookie'][1].startsWith(`${COOKIE_NAMES.accessToken}=;`)).toBeTruthy();
  expect(res.body.status === 'success').toBeTruthy();
});
