import type { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';

let fastify: FastifyInstance;

export const websocket = {
  init: (app: FastifyInstance): void => {
    fastify = app;
  },
  broadcast: (data: Record<string, unknown>): void => {
    fastify.websocketServer.clients.forEach((socket) => {
      if (socket.readyState !== WebSocket.OPEN) return;

      socket.send(JSON.stringify(data));
    });
  },
};
