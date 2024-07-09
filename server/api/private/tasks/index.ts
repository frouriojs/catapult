import type { DefineMethods } from 'aspida';
import type { MaybeId } from 'common/types/brandedId';
import type { TaskCreateVal, TaskDto, TaskUpdateDoneDto } from 'common/types/task';

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
