import assert from 'assert';
import { InbucketAPIClient } from 'inbucket-js-client';
import { SERVER_PORT } from 'service/envValues';

export const TEST_PORT = SERVER_PORT - 1;

export const TEST_USERNAME_PREFIX = 'test-username-prefix';

export const GET = (api: { get: unknown; $path: () => string }): string => `GET: ${api.$path()}`;

export const POST = (api: { post: unknown; $path: () => string }): string => `POST: ${api.$path()}`;

export const PATCH = (api: { patch: unknown; $path: () => string }): string =>
  `PATCH: ${api.$path()}`;

export const DELETE = (api: { delete: unknown; $path: () => string }): string =>
  `DELETE: ${api.$path()}`;

assert(process.env.INBUCKET_URL);

export const inbucketClient = new InbucketAPIClient(process.env.INBUCKET_URL);

export const fetchMailBodyAndTrash = async (email: string): Promise<string> => {
  const mailbox = await inbucketClient.mailbox(email);
  const message = await inbucketClient.message(email, mailbox[0]!.id);

  await inbucketClient.deleteMessage(email, mailbox[0]!.id);

  return message.body.text.trim();
};
