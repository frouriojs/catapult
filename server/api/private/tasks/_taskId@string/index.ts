import type { TaskDto } from 'api/@types/task';
import type { DefineMethods } from 'aspida';

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
