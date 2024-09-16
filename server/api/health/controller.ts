import { cognito } from 'service/cognito';
import { CustomError } from 'service/customAssert';
import { prismaClient } from 'service/prismaClient';
import { s3 } from 'service/s3Client';
import { defineController } from './$relay';

const throwCustomError = (label: string) => (e: Error) => {
  /* v8 ignore next 2 */
  throw new CustomError(`${label} ${e.message}`);
};

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: {
      server: 'ok',
      db: await prismaClient.$queryRaw`SELECT CURRENT_TIMESTAMP;`
        .then(() => 'ok' as const)
        .catch(throwCustomError('DB')),
      s3: await s3
        .health()
        .then(() => 'ok' as const)
        .catch(throwCustomError('S3')),
      cognito: await cognito
        .health()
        .then(() => 'ok' as const)
        .catch(throwCustomError('Cognito')),
    },
  }),
}));
