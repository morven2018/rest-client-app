import { avatarSchema, usernameSchema } from './common-schemas';
import { loginSchema } from './login-schema';

export const registerSchema = (t: (key: string) => string) =>
  loginSchema(t).extend({
    username: usernameSchema(t),
    avatar: avatarSchema(t),
  });
