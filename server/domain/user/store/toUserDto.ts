import type { User } from '@prisma/client';
import type { UserDto } from 'common/types/user';
import { brandedId } from 'common/validators/brandedId';

export const toUserDto = (prismaUser: User): UserDto => ({
  id: brandedId.user.dto.parse(prismaUser.id),
  email: prismaUser.email,
  signInName: prismaUser.signInName,
  displayName: prismaUser.displayName,
  photoUrl: prismaUser.photoUrl ?? undefined,
  createdTime: prismaUser.createdAt.getTime(),
});
