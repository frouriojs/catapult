import type { MultipartFile } from '@fastify/multipart';
import type { EntityId } from 'common/types/brandedId';
import type { TaskBase } from 'common/types/task';

export type TaskEntity = TaskBase & { id: EntityId['task']; imageKey: string | undefined };

export type CreateTaskPayload = { label: string; image?: MultipartFile };
