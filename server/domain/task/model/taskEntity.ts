import type { MultipartFile } from '@fastify/multipart';
import type { TaskDto } from 'common/types/task';
import type { EntityId } from 'service/brandedId';
import type { S3PutParams } from 'service/s3Client';

export type TaskEntity = Omit<TaskDto, 'id' | 'image' | 'author'> & {
  id: EntityId['task'];
  imageKey: string | undefined;
  author: Omit<TaskDto['author'], 'id'> & { id: EntityId['user'] };
};

export type TaskCreateServerVal = { label: string; image?: MultipartFile };

export type TaskSaveVal = { task: TaskEntity; s3Params?: S3PutParams };

export type TaskDeleteVal = { deletable: boolean; task: TaskEntity };
