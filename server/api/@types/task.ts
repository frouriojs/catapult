import type { WS_TYPES } from 'api/@constants';
import type { DtoId, MaybeId } from './brandedId';

export type TaskDto = {
  id: DtoId['task'];
  label: string;
  done: boolean;
  createdTime: number;
  image: { url: string; s3Key: string } | undefined;
  author: { id: DtoId['user']; signInName: string };
};

export type TaskCreateVal = { label: string; image?: Blob };

export type TaskUpdateVal = { taskId: MaybeId['task']; label?: string; done?: boolean };

export type TaskCreated = { type: (typeof WS_TYPES)[0]; task: TaskDto };

export type TaskUpdated = { type: (typeof WS_TYPES)[1]; task: TaskDto };

export type TaskDeleted = { type: (typeof WS_TYPES)[2]; taskId: DtoId['task'] };

export type TaskEvent = TaskCreated | TaskUpdated | TaskDeleted;
