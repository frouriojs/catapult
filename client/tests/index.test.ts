import { toOpenAPI } from 'aspida2openapi';
import { readFileSync } from 'fs';
import { join } from 'path';
import { staticPath } from 'utils/$path';
import { expect, test } from 'vitest';

test('check OpenAPI diff', () => {
  const openapi = join('./public', staticPath.docs.openapi_json);
  const generated = toOpenAPI({ input: 'api', template: openapi });

  expect(generated).toBe(readFileSync(openapi, 'utf8'));
});
