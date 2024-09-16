import type { DtoId } from './brandedId';

export type UserDto = {
  id: DtoId['user'];
  signInName: string;
  displayName: string;
  email: string;
  createdTime: number;
  photoUrl: string | undefined;
};
