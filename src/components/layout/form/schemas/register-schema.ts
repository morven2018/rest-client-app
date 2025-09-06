import { z } from 'zod';
import { loginSchema } from './login-schema';

export const registerSchema = (t: (key: string) => string) =>
  loginSchema(t).extend({
    username: z
      .string()
      .optional()
      .refine((val) => !val || val[0]?.toUpperCase() === val[0], {
        message: t('name-uppercase'),
      })
      .refine((val) => !val || (val.length >= 3 && val.length <= 20), {
        message: t('name-length'),
      })
      .refine((val) => !val || /^[a-zA-Zа-яА-Я\d_ ]+$/.test(val), {
        message: t('name-format'),
      }),

    avatar: z
      .instanceof(File)
      .optional()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type.startsWith('image/')),
        t('image-only')
      ),
  });
