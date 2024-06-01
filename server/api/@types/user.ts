import type { EntityId } from './brandedId';

export type UserEntity = {
  id: EntityId['user'];
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
  createdTime: number;
};
