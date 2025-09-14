import { z } from 'zod';
import { emailSchema, passwordSchema } from './common-schemas';

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: emailSchema(t),
    password: passwordSchema(t),
  });
