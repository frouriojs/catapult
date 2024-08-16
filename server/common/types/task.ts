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
