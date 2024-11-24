import type { DefineMethods } from 'aspida';
import type { TaskDto } from 'common/types/task';
import type {
  CreateTaskBody,
  DeleteTaskBody,
  ListTaskQuery,
  UpdateTaskBody,
} from 'common/validators/task';

export type Methods = DefineMethods<{
  get: {
    query?: ListTaskQuery;
    resBody: TaskDto[];
  };

  post: {
    reqFormat: FormData;
    reqBody: CreateTaskBody;
    resBody: TaskDto;
  };

  patch: {
    reqBody: UpdateTaskBody;
    resBody: TaskDto;
  };

  delete: {
    reqBody: DeleteTaskBody;
    resBody: TaskDto;
  };
}>;
