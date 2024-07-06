import type { TaskDto } from 'api/@types/task';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  patch: {
    reqBody: {
      label?: string;
      done?: boolean;
    };
    status: 204;
    resBody: TaskDto;
  };

  delete: {
    status: 204;
    resBody: TaskDto;
  };
}>;
