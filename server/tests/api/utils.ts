import type { WS_TYPES } from 'common/constants';
import { SERVER_PORT } from 'service/envValues';

export const TEST_PORT = SERVER_PORT - 1;

export const GET = (api: { $path: () => string }): string => `GET: ${api.$path()}`;

export const POST = (api: { $path: () => string }): string => `POST: ${api.$path()}`;

export const PATCH = (api: { $path: () => string }): string => `PATCH: ${api.$path()}`;

export const DELETE = (api: { $path: () => string }): string => `DELETE: ${api.$path()}`;

export const WS = (type: (typeof WS_TYPES)[number]): string => `WS: ${type}`;
