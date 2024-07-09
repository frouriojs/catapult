import type { UserDto } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import type { UserEntity } from '../model/userEntity';

export const toUserDto = (user: UserEntity): UserDto => ({
  ...user,
  id: brandedId.user.dto.parse(user.id),
});
