import { z } from 'zod';

export const labelValidator = z
  .string()
  .min(1, 'ラベルを入力してください')
  .max(20, 'ラベルは20文字以内です');
