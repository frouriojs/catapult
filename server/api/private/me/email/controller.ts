import { userUseCase } from 'domain/user/userUseCase';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  post: {
    validators: { body: z.object({ code: z.string() }) },
    handler: async ({ user, accessToken, body }) => ({
      status: 200,
      body: await userUseCase.confirmEmail(user, accessToken, body.code),
    }),
  },
}));
