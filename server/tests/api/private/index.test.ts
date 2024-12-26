import {
  AdminInitiateAuthCommand,
  UpdateUserAttributesCommand,
  VerifyUserAttributeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import { COGNITO_USER_POOL_CLIENT_ID, COGNITO_USER_POOL_ID } from 'service/envValues';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';
import {
  createCognitoUser,
  createGoogleUser,
  createUserClient,
  noCookieClient,
} from '../apiClient';
import { cognitoClient } from '../cognito';
import { fetchMailBodyAndTrash, GET } from '../utils';

test(GET(noCookieClient.private), async () => {
  const apiClient = await createCognitoUser().then(createUserClient);
  const res = await apiClient.private.$get();

  expect(res).toEqual('');

  await expect(noCookieClient.private.get()).rejects.toHaveProperty('response.status', 401);
});

test(`${GET(noCookieClient.private.me)} - cognito user`, async () => {
  const { userName, password, ...tokens } = await createCognitoUser();
  const apiClient1 = await createUserClient(tokens);
  const res1 = await apiClient1.private.me.get();

  expect(res1.status).toEqual(200);

  const newEmail = `${ulid()}@example.com`;

  await cognitoClient.send(
    new UpdateUserAttributesCommand({
      AccessToken: tokens.accessToken,
      UserAttributes: [{ Name: 'email', Value: newEmail }],
    }),
  );

  const message = await fetchMailBodyAndTrash(newEmail);

  await cognitoClient.send(
    new VerifyUserAttributeCommand({
      AccessToken: tokens.accessToken,
      AttributeName: 'email',
      Code: message.split(' ').at(-1),
    }),
  );

  const command2 = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_USER_POOL_CLIENT_ID,
    AuthParameters: { USERNAME: userName, PASSWORD: password },
  });
  const res2 = await cognitoClient.send(command2);

  assert(res2.AuthenticationResult?.IdToken);
  assert(res2.AuthenticationResult?.AccessToken);

  const apiClient2 = await createUserClient({
    idToken: res2.AuthenticationResult.IdToken,
    accessToken: res2.AuthenticationResult.AccessToken,
  });
  const res3 = await apiClient2.private.me.$get();

  expect(res3.email).toEqual(newEmail);
});

test(`${GET(noCookieClient.private.me)} - google user`, async () => {
  const apiClient = await createGoogleUser().then(createUserClient);
  const res = await apiClient.private.me.get().then(() => apiClient.private.me.get());

  expect(res.status).toEqual(200);
});
