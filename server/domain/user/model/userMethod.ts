import type { UserEntity } from 'api/@types/user';
import assert from 'assert';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { brandedId } from 'service/brandedId';

export const userMethod = {
  create: (record: UserRecord): UserEntity => {
    assert(record.email);

    return {
      id: brandedId.user.entity.parse(record.uid),
      email: record.email,
      displayName: record.displayName,
      photoURL: record.photoURL,
      createdTime: Date.now(),
    };
  },
};
