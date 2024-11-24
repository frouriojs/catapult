import type { EntityId } from 'common/types/brandedId';
import type { UserBase } from 'common/types/user';

export type UserEntity = UserBase & { id: EntityId['user'] };
