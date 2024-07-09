import type { MaybeId } from 'api/@types/brandedId';
import type { TaskCreateVal, TaskDto, TaskUpdateDoneDto } from 'api/@types/task';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
    };
    resBody: TaskDto[];
  };

  post: {
    reqFormat: FormData;
    reqBody: TaskCreateVal;
    resBody: TaskDto;
  };

  patch: {
    reqBody: TaskUpdateDoneDto;
    status: 200;
    resBody: TaskDto;
  };

  delete: {
    reqBody: {
      taskId: MaybeId['task'];
    };
    status: 200;
    resBody: TaskDto;
  };
}>;
