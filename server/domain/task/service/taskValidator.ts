import { multipartFileValidator } from 'api/$relay';
import type { TaskUpdateDoneDto } from 'common/types/task';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';
import type { TaskCreateServerVal } from '../model/taskType';

export const taskValidator = {
  taskCreate: z.object({
    label: z.string(),
    image: multipartFileValidator().optional(),
  }) satisfies z.ZodType<TaskCreateServerVal>,
  taskUpdate: z.object({
    taskId: brandedId.task.maybe,
    done: z.boolean(),
  }) satisfies z.ZodType<TaskUpdateDoneDto>,
};
