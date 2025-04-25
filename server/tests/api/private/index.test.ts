import { UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import { cognitoClient } from 'service/cognito';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';
import {
  createCognitoUser,
  createGoogleUser,
  createUserClient,
  noCookieClient,
} from '../apiClient';
import { fetchMailBodyAndTrash, GET } from '../utils';

test(GET(noCookieClient.private), async () => {
  const apiClient = await createGoogleUser().then(createUserClient);
  const res = await apiClient.private.$get();

  expect(res).toEqual('');

  await expect(noCookieClient.private.get()).rejects.toHaveProperty('response.status', 401);
});

test(GET(noCookieClient.private.me), async () => {
  const tokens = await createCognitoUser();
  const apiClient = createUserClient(tokens);
  const res1 = await apiClient.private.me.get();

  expect(res1.status).toEqual(200);

  const newEmail = `${ulid()}@example.com`;

  await cognitoClient.send(
    new UpdateUserAttributesCommand({
      AccessToken: tokens.accessToken,
      UserAttributes: [{ Name: 'email', Value: newEmail }],
    }),
  );

  const code = await fetchMailBodyAndTrash(newEmail).then((message) => message.split(' ').at(-1));

  assert(code);

  await apiClient.private.me.email.$post({ body: { code } });

  const res3 = await apiClient.private.me.$get();

  expect(res3.email).toEqual(newEmail);
});
