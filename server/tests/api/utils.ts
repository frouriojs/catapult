import { SERVER_PORT } from 'service/envValues';

export const TEST_PORT = SERVER_PORT - 1;

export const GET = (api: { get: unknown; $path: () => string }): string => `GET: ${api.$path()}`;

export const POST = (api: { post: unknown; $path: () => string }): string => `POST: ${api.$path()}`;

export const PATCH = (api: { patch: unknown; $path: () => string }): string =>
  `PATCH: ${api.$path()}`;

export const DELETE = (api: { delete: unknown; $path: () => string }): string =>
  `DELETE: ${api.$path()}`;
