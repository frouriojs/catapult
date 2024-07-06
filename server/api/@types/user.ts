import type { DtoId } from './brandedId';

export type UserDto = {
  id: DtoId['user'];
  signInName: string;
  email: string;
  createdTime: number;
};
