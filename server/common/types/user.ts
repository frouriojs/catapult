import type { DtoId } from './brandedId';

export type UserBase = {
  signInName: string;
  displayName: string;
  email: string;
  createdTime: number;
  photoUrl: string | undefined;
};

export type UserDto = UserBase & { id: DtoId['user'] };
