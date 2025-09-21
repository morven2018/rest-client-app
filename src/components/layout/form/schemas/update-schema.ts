import { z } from 'zod';
import { avatarSchema, usernameSchema } from './common-schemas';

export const updateAccountSchema = (t: (key: string) => string) =>
  z.object({
    username: usernameSchema(t),
    avatar: avatarSchema(t),
  });
