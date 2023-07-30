import { z } from 'zod';
import type { TaskId, UserId } from '../commonTypesWithClient/branded';

export const userIdParser: z.ZodType<UserId> = z.string().brand<'UserId'>();

export const taskIdParser: z.ZodType<TaskId> = z.string().brand<'TaskId'>();
