import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqBody: { idToken: string; accessToken: string };
    resBody: { status: 'success' };
  };
  delete: {
    resBody: { status: 'success' };
  };
}>;
