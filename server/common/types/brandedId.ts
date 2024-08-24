import type { ID_NAME_LIST } from 'common/constants';
import type { z } from 'zod';

type IdName = (typeof ID_NAME_LIST)[number];

type Branded<T extends string> = string & z.BRAND<T>;

type Dto<T extends IdName> = string & z.BRAND<`${T}DtoId`>;

export type DtoId = { [T in IdName]: Dto<T> };

export type MaybeId = { [T in IdName]: Dto<T> | Branded<'maybe'> };
