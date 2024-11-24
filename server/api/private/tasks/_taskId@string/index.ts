import type { DefineMethods } from 'aspida';
import type { TaskDto } from 'common/types/task';

export type Methods = DefineMethods<{
  patch: {
    reqBody: {
      done: boolean;
    };
    resBody: TaskDto;
  };

  delete: {
    resBody: TaskDto;
  };
}>;
