import { z } from 'zod';

export const updateAccountSchema = (t: (key: string) => string) =>
  z.object({
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
      )
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, t('image-size')),
  });
