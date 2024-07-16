import assert from 'assert';

export class CustomError extends Error {}

export function customAssert(val: unknown, msg: string): asserts val {
  assert(val, new CustomError(msg));
}
