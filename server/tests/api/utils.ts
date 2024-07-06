import { WS_PATH } from 'api/@constants';
import { SERVER_PORT } from 'service/envValues';
import WebSocket from 'ws';

export const createWsClient = (): Promise<WebSocket> => {
  return new Promise<WebSocket>((resolve): void => {
    const ws = new WebSocket(`ws://127.0.0.1:${SERVER_PORT}${WS_PATH}`);
    ws.on('open', () => resolve(ws));
  });
};

export const GET = (api: { $path: () => string }): string => `GET: ${api.$path()}`;
export const POST = (api: { $path: () => string }): string => `POST: ${api.$path()}`;
export const PATCH = (api: { $path: () => string }): string => `PATCH: ${api.$path()}`;
export const DELETE = (api: { $path: () => string }): string => `DELETE: ${api.$path()}`;
