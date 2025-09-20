import { z } from 'zod';

export const usernameSchema = (t: (key: string) => string) =>
  z
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
    });

export const avatarSchema = (t: (key: string) => string) =>
  z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith('image/')),
      t('image-only')
    )
    .refine((file) => !file || file.size <= 500 * 1024, t('image-size'))
    .refine((file) => {
      if (!file) return true;
      const estimatedBase64Size = file.size * 1.37;
      return estimatedBase64Size <= 700 * 1024;
    }, t('image-too-big'));

export const passwordSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(1, t('required'))
    .regex(/\d/, t('digit'))
    .regex(/[\p{Lu}]/u, t('uppercase'))
    .regex(/[\p{Ll}]/u, t('lowercase'))
    .regex(/[^\p{L}\d]/u, t('special'))
    .min(8, t('min'));

export const emailSchema = (t: (key: string) => string) =>
  z.string().min(1, t('required')).email(t('email'));
