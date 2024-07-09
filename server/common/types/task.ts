import type { WS_TYPES } from 'common/constants';
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

export type TaskUpdateDoneDto = { taskId: MaybeId['task']; done: boolean };

export type TaskCreatedEvent = { type: (typeof WS_TYPES)[0]; task: TaskDto };

export type TaskUpdatedEvent = { type: (typeof WS_TYPES)[1]; task: TaskDto };

export type TaskDeletedEvent = { type: (typeof WS_TYPES)[2]; taskId: DtoId['task'] };

export type TaskEvent = TaskCreatedEvent | TaskUpdatedEvent | TaskDeletedEvent;
