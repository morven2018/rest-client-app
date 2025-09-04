import { z } from 'zod';

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t('required')).email(t('email')),
    password: z
      .string()
      .min(1, t('required'))
      .regex(/\d/, t('digit'))
      .regex(/[A-Z]/, t('uppercase'))
      .regex(/[a-z]/, t('lowercase'))
      .regex(/[^A-Za-z0-9]/, t('special'))
      .min(8, t('min')),
  });
