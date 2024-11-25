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
    body: await Promise.all([
      prismaClient.$queryRaw`SELECT CURRENT_TIMESTAMP;`.catch(throwCustomError('DB')),
      s3.health().catch(throwCustomError('S3')),
      cognito.health().catch(throwCustomError('Cognito')),
    ]).then(() => 'ok'),
  }),
}));
