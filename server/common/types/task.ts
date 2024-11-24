import type { DtoId } from './brandedId';

export type TaskBase = {
  label: string;
  done: boolean;
  createdTime: number;
  author: { id: DtoId['user']; signInName: string };
};

export type TaskDto = TaskBase & {
  id: DtoId['task'];
  image: { url: string; s3Key: string } | undefined;
};
