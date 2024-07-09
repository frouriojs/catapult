import type { DefineMethods } from 'aspida';
import type { TaskDto } from 'common/types/task';

export type Methods = DefineMethods<{
  get: {
    resBody: TaskDto[];
  };
}>;
