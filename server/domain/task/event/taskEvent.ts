import { WS_TYPES } from 'api/@constants';
import type { TaskCreated, TaskDeleted, TaskEntity, TaskUpdated } from 'api/@types/task';
import { websocket } from 'service/websocket';

export const taskEvent = {
  created: (task: TaskEntity): void => {
    const data: TaskCreated = { type: WS_TYPES[0], task };
    websocket.broadcast(data);
  },
  updated: (task: TaskEntity): void => {
    const data: TaskUpdated = { type: WS_TYPES[1], task };
    websocket.broadcast(data);
  },
  deleted: (task: TaskEntity): void => {
    const data: TaskDeleted = { type: WS_TYPES[2], taskId: task.id };
    websocket.broadcast(data);
  },
};
