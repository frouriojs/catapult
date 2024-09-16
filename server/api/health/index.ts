import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: Record<'server' | 'db' | 's3' | 'cognito', 'ok'>;
  };
}>;
