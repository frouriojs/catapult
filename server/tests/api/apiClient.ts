import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { COOKIE_NAME } from 'service/constants';
import { API_BASE_PATH, COGNITO_POOL_ENDPOINT, PORT } from 'service/envValues';
import { ulid } from 'ulid';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const createUserClient = async (): Promise<{
  userClient: typeof noCookieClient;
  cleanUp: () => Promise<void>;
}> => {
  const cognitoUrl = `${COGNITO_POOL_ENDPOINT}/backdoor`;
  const tokens = await fetch(cognitoUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'test-client',
      email: `${ulid()}@example.com`,
      password: 'test-client-password',
    }),
  }).then((b) => b.json());
  const agent = axios.create({
    baseURL,
    headers: { cookie: `${COOKIE_NAME}=${tokens.IdToken}`, 'Content-Type': 'text/plain' },
  });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return {
    userClient: api(aspida(agent)),
    cleanUp: async (): Promise<void> => {
      await fetch(cognitoUrl, {
        method: 'DELETE',
        headers: { cookie: `${COOKIE_NAME}=${tokens.IdToken}` },
      });
    },
  };
};
