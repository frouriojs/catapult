import type { DtoId } from 'api/@types/brandedId';

export type JwtUser = { sub: DtoId['user']; 'cognito:username': string; email: string };
