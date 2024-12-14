import { z } from 'zod';

const NEXT_PUBLIC_API_BASE_PATH = z.string().parse(process.env.NEXT_PUBLIC_API_BASE_PATH);
const NEXT_PUBLIC_COGNITO_USER_POOL_ID = z
  .string()
  .parse(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID);
const NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = z
  .string()
  .parse(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID);
const NEXT_PUBLIC_COGNITO_POOL_ENDPOINT = z
  .string()
  .parse(process.env.NEXT_PUBLIC_COGNITO_POOL_ENDPOINT);
const NEXT_PUBLIC_OAUTH_DOMAIN = z.string().optional().parse(process.env.NEXT_PUBLIC_OAUTH_DOMAIN);
const NEXT_PUBLIC_SERVER_PORT = z.string().parse(process.env.NEXT_PUBLIC_SERVER_PORT);

export {
  NEXT_PUBLIC_API_BASE_PATH,
  NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
  NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_OAUTH_DOMAIN,
  NEXT_PUBLIC_SERVER_PORT,
};
