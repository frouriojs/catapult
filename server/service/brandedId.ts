import { BRANDED_ID_NAMES } from 'common/constants';
import type { DtoId, MaybeId } from 'common/types/brandedId';
import { z } from 'zod';

type IdName = (typeof BRANDED_ID_NAMES)[number];

type Entity<T extends IdName> = string & z.BRAND<`${T}EntityId`>;

export type EntityId = { [T in IdName]: Entity<T> };

export const brandedId = BRANDED_ID_NAMES.reduce(
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
