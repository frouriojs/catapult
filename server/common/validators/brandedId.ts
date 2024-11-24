import { ID_NAME_LIST } from 'common/constants';
import type { DtoId, EntityId, IdName, MaybeId } from 'common/types/brandedId';
import { z } from 'zod';

export const brandedId = ID_NAME_LIST.reduce(
  (dict, current) => ({
    ...dict,
    [current]: { entity: z.string(), dto: z.string(), maybe: z.string() },
  }),
  {} as {
    [Name in IdName]: {
      entity: z.ZodType<EntityId[Name]>;
      dto: z.ZodType<DtoId[Name]>;
      maybe: z.ZodType<MaybeId[Name]>;
    };
  },
);
