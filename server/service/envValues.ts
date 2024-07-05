import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '../client/.env' });
dotenv.config();

const SERVER_PORT = +z.string().regex(/^\d+$/).parse(process.env.SERVER_PORT);
const API_BASE_PATH = z.string().startsWith('/').parse(process.env.NEXT_PUBLIC_API_BASE_PATH);
const COGNITO_POOL_ENDPOINT = z.string().parse(process.env.NEXT_PUBLIC_COGNITO_POOL_ENDPOINT);
const COGNITO_USER_POOL_ID = z.string().parse(process.env.COGNITO_USER_POOL_ID);
const COGNITO_USER_POOL_CLIENT_ID = z.string().parse(process.env.COGNITO_USER_POOL_CLIENT_ID);
const S3_ENDPOINT = z.string().parse(process.env.S3_ENDPOINT ?? '');
const S3_BUCKET = z.string().parse(process.env.S3_BUCKET ?? '');
const S3_ACCESS_KEY = z.string().parse(process.env.S3_ACCESS_KEY ?? '');
const S3_SECRET_KEY = z.string().parse(process.env.S3_SECRET_KEY ?? '');
const S3_REGION = z.string().parse(process.env.S3_REGION ?? '');

export {
  API_BASE_PATH,
  COGNITO_POOL_ENDPOINT,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  S3_ACCESS_KEY,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_REGION,
  S3_SECRET_KEY,
  SERVER_PORT,
};
