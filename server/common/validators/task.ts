import { z } from 'zod';
import { brandedId } from './brandedId';

const createBodyBase = z.object({ label: z.string().min(1).max(20) });

export const taskValidator = {
  listQuery: z.object({ limit: z.number().int().optional() }),
  createBodyBase,
  createBody: createBodyBase.and(z.object({ image: z.instanceof(File).optional() })),
  updateBody: z.object({ taskId: brandedId.task.maybe, done: z.boolean() }),
  deleteBody: z.object({ taskId: brandedId.task.maybe }),
};

export type ListTaskQuery = z.infer<typeof taskValidator.listQuery>;

export type CreateTaskBody = z.infer<typeof taskValidator.createBody>;

export type UpdateTaskBody = z.infer<typeof taskValidator.updateBody>;

export type DeleteTaskBody = z.infer<typeof taskValidator.deleteBody>;
