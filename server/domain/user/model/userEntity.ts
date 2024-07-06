import type { UserDto } from 'api/@types/user';
import type { EntityId } from 'service/brandedId';

export type UserEntity = Omit<UserDto, 'id'> & { id: EntityId['user'] };
