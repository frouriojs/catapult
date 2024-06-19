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
