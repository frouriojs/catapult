import aspida from '@aspida/axios';
import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import api from 'api/$api';
import assert from 'assert';
import axios from 'axios';
import { createHash } from 'crypto';
import { COOKIE_NAMES } from 'service/constants';
import {
  API_BASE_PATH,
  COGNITO_POOL_ENDPOINT,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from 'service/envValues';
import { cognitoClient } from 'tests/api/cognito';
import { ulid } from 'ulid';
import { TEST_PORT } from './utils';

const baseURL = `http://127.0.0.1:${TEST_PORT}${API_BASE_PATH}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

type Tokens = { idToken: string; accessToken: string };

export const createCognitoUser = async (): Promise<Tokens> => {
  const userName = `test-${ulid()}`;
  const password = `Test-user-${ulid()}`;
  const command1 = new AdminCreateUserCommand({
    UserPoolId: COGNITO_USER_POOL_ID,
    Username: userName,
    TemporaryPassword: password,
    UserAttributes: [{ Name: 'email', Value: `${ulid()}@example.com` }],
  });

  await cognitoClient.send(command1);

  const command2 = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_USER_POOL_CLIENT_ID,
    AuthParameters: { USERNAME: userName, PASSWORD: password },
  });
  const res = await cognitoClient.send(command2);

  assert(res.AuthenticationResult?.IdToken);
  assert(res.AuthenticationResult?.AccessToken);

  return {
    idToken: res.AuthenticationResult.IdToken,
    accessToken: res.AuthenticationResult.AccessToken,
  };
};

export const createGoogleUser = async (): Promise<Tokens> => {
  const userName = `test-${ulid()}`;
  const codeVerifier = ulid();
  const user = await fetch(`${COGNITO_POOL_ENDPOINT}/public/socialUsers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'Google',
      name: userName,
      email: `${ulid()}@example.com`,
      photoUrl: 'https://example.com/user.png',
      codeChallenge: createHash('sha256').update(codeVerifier).digest('base64url'),
      userPoolClientId: COGNITO_USER_POOL_CLIENT_ID,
    }),
  }).then((res) => res.json());
  const tokens = await fetch(`${COGNITO_POOL_ENDPOINT}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: user.authorizationCode,
      client_id: COGNITO_USER_POOL_CLIENT_ID,
      redirect_uri: 'https://example.com',
      code_verifier: codeVerifier,
    }),
  }).then((res) => res.json());

  return { idToken: tokens.id_token, accessToken: tokens.access_token };
};

export const createUserClient = async (tokens: Tokens): Promise<typeof noCookieClient> => {
  const cookie = `${COOKIE_NAMES.idToken}=${tokens.idToken};${COOKIE_NAMES.accessToken}=${tokens.accessToken}`;
  const agent = axios.create({ baseURL, headers: { cookie, 'Content-Type': 'text/plain' } });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
