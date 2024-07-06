import { WS_TYPES } from 'api/@constants';
import type { TaskCreated, TaskDeleted, TaskUpdated } from 'api/@types/task';
import { websocket } from 'service/websocket';
import type { TaskEntity } from '../model/taskEntity';
import { toTaskDto } from '../service/toTaskDto';

export const taskEvent = {
  created: (task: TaskEntity): void => {
    const data: TaskCreated = { type: WS_TYPES[0], task: toTaskDto(task) };
    websocket.broadcast(data);
  },
  updated: (task: TaskEntity): void => {
    const data: TaskUpdated = { type: WS_TYPES[1], task: toTaskDto(task) };
    websocket.broadcast(data);
  },
  deleted: (task: TaskEntity): void => {
    const data: TaskDeleted = { type: WS_TYPES[2], taskId: toTaskDto(task).id };
    websocket.broadcast(data);
  },
};
