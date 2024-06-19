import { z } from 'zod';

const NEXT_PUBLIC_API_BASE_PATH = z.string().parse(process.env.NEXT_PUBLIC_API_BASE_PATH);
const COGNITO_USER_POOL_ID = z.string().parse(process.env.COGNITO_USER_POOL_ID);
const COGNITO_USER_POOL_CLIENT_ID = z.string().parse(process.env.COGNITO_USER_POOL_CLIENT_ID);
const NEXT_PUBLIC_COGNITO_POOL_ENDPOINT = z
  .string()
  .parse(process.env.NEXT_PUBLIC_COGNITO_POOL_ENDPOINT);

export {
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_API_BASE_PATH,
  NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
};
