import { ID_NAME_LIST } from 'common/constants';
import type { DtoId, MaybeId } from 'common/types/brandedId';
import { z } from 'zod';

type IdName = (typeof ID_NAME_LIST)[number];

type Entity<T extends IdName> = string & z.BRAND<`${T}EntityId`>;

export type EntityId = { [T in IdName]: Entity<T> };

export const brandedId = ID_NAME_LIST.reduce(
  (dict, current) => ({
    ...dict,
    [current]: { entity: z.string(), maybe: z.string(), dto: z.string() },
  }),
  {} as {
    [Name in IdName]: {
      entity: z.ZodType<EntityId[Name]>;
      maybe: z.ZodType<MaybeId[Name]>;
      dto: z.ZodType<DtoId[Name]>;
    };
  },
);
