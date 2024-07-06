import type { WS_TYPES } from 'api/@constants';
import type { EntityId, MaybeId } from './brandedId';

export type TaskEntity = {
  id: EntityId['task'];
  label: string;
  done: boolean;
  createdTime: number;
  image: { url: string; s3Key: string } | undefined;
  author: { id: EntityId['user']; signInName: string };
};

export type TaskCreateVal = { label: string; image?: Blob };

export type TaskUpdateVal = { taskId: MaybeId['task']; label?: string; done?: boolean };

export type TaskCreated = { type: (typeof WS_TYPES)[0]; task: TaskEntity };

export type TaskUpdated = { type: (typeof WS_TYPES)[1]; task: TaskEntity };

export type TaskDeleted = { type: (typeof WS_TYPES)[2]; taskId: EntityId['task'] };

export type TaskEvent = TaskCreated | TaskUpdated | TaskDeleted;
