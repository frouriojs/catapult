import type { DefineMethods } from 'aspida';
import type { TaskDto } from 'common/types/task';

export type Methods = DefineMethods<{
  patch: {
    reqBody: {
      done: boolean;
    };
    status: 200;
    resBody: TaskDto;
  };

  delete: {
    status: 200;
    resBody: TaskDto;
  };
}>;
