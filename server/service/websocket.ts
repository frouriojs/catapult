import { WS_PING, WS_PONG } from 'common/constants';
import type { DtoId } from 'common/types/brandedId';
import type { WebSocketData } from 'common/types/websocket';
import type { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';

let fastify: FastifyInstance;

const users: Record<DtoId['user'], WebSocket[] | undefined> = {};

const sendJson = (socket: WebSocket, data: WebSocketData): void => {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(data));
};

export const websocket = {
  init: (app: FastifyInstance): void => {
    fastify = app;
  },
  add: (userId: DtoId['user'], socket: WebSocket): void => {
    users[userId] = [socket, ...(users[userId] ?? [])];

    socket.on('message', (msg) => {
      if (socket.readyState !== WebSocket.OPEN) return;

      if (msg.toString() === WS_PING) socket.send(WS_PONG);
    });

    socket.on('close', () => {
      users[userId] = users[userId]?.filter((s) => s !== socket);
    });
  },
  send: (userId: DtoId['user'], data: WebSocketData): void => {
    users[userId]?.forEach((socket) => sendJson(socket, data));
  },
  broadcastToAuthedClients: (data: WebSocketData): void => {
    Object.values(users)
      .filter((user) => user !== undefined)
      .forEach((sockets) => sockets.forEach((socket) => sendJson(socket, data)));
  },
  broadcast: (data: WebSocketData): void => {
    fastify.websocketServer.clients.forEach((socket) => sendJson(socket, data));
  },
};
