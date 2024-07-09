import type { DtoId } from 'common/types/brandedId';

export type JwtUser = { sub: DtoId['user']; 'cognito:username': string; email: string };
