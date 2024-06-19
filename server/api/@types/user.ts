import type { EntityId } from './brandedId';

export type UserEntity = {
  id: EntityId['user'];
  signInName: string;
  email: string;
  createdTime: number;
};
