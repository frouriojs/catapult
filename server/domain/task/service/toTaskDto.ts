import type { TaskDto } from 'common/types/task';
import { brandedId } from 'service/brandedId';
import type { TaskEntity } from '../model/taskEntity';

export const toTaskDto = (task: TaskEntity): TaskDto => ({
  ...task,
  id: brandedId.task.dto.parse(task.id),
  author: { ...task.author, id: brandedId.user.dto.parse(task.author.id) },
});
