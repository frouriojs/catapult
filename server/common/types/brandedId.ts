import type { BRANDED_ID_NAMES } from 'common/constants';
import type { z } from 'zod';

type IdName = (typeof BRANDED_ID_NAMES)[number];

type Branded<T extends string> = string & z.BRAND<T>;

type Dto<T extends IdName> = string & z.BRAND<`${T}DtoId`>;

export type DtoId = { [T in IdName]: Dto<T> };

export type MaybeId = { [T in IdName]: Dto<T> | Branded<'maybe'> };
