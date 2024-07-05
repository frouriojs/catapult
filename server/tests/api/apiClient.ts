import aspida from '@aspida/axios';
import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import api from 'api/$api';
import assert from 'assert';
import axios from 'axios';
import { COOKIE_NAME } from 'service/constants';
import {
  API_BASE_PATH,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  SERVER_PORT,
} from 'service/envValues';
import { cognitoClient } from 'tests/api/cognito';

const baseURL = `http://127.0.0.1:${SERVER_PORT}${API_BASE_PATH}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const createUserClient = async (): Promise<typeof noCookieClient> => {
  const userName = `test-${Date.now()}`;
  const password = `Test-user-${Date.now()}`;
  const command1 = new AdminCreateUserCommand({
    UserPoolId: COGNITO_USER_POOL_ID,
    Username: userName,
    TemporaryPassword: password,
    UserAttributes: [{ Name: 'email', Value: `${Date.now()}@example.com` }],
  });

  await cognitoClient.send(command1);

  const command2 = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_USER_POOL_CLIENT_ID,
    AuthParameters: { USERNAME: userName, PASSWORD: password },
  });

  const res = await cognitoClient.send(command2);
  assert(res.AuthenticationResult);

  const agent = axios.create({
    baseURL,
    headers: {
      cookie: `${COOKIE_NAME}=${res.AuthenticationResult.IdToken}`,
      'Content-Type': 'text/plain',
    },
  });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
