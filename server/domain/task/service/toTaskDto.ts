import type { TaskDto } from 'common/types/task';
import { brandedId } from 'service/brandedId';
import { s3 } from 'service/s3Client';
import type { TaskEntity } from '../model/taskType';

export const toTaskDto = (task: TaskEntity): TaskDto => ({
  ...task,
  id: brandedId.task.dto.parse(task.id),
  image: task.imageKey ? { s3Key: task.imageKey, url: s3.keyToUrl(task.imageKey) } : undefined,
  author: { ...task.author, id: brandedId.user.dto.parse(task.author.id) },
});
