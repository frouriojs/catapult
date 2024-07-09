import type { DefineMethods } from 'aspida';
import type { UserDto } from 'common/types/user';

export type Methods = DefineMethods<{
  get: {
    resBody: UserDto;
  };
}>;
