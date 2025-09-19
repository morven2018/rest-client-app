import { loginSchema } from '@/components/layout/form/schemas/login-schema';

const mockT = (key: string) => `translated_${key}`;

describe('loginSchema', () => {
  const schema = loginSchema(mockT);
  const validData = {
    email: 'user@example.com',
    password: 'ValidPassword123!',
  };

  it('validate correct login data', () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty object', () => {
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });

  describe('missing required fields', () => {
    it('reject missing email', () => {
      const result = schema.safeParse({ password: validData.password });
      expect(result.success).toBe(false);
    });

    it('reject missing password', () => {
      const result = schema.safeParse({ email: validData.email });
      expect(result.success).toBe(false);
    });
  });

  describe('invalid field formats', () => {
    it('reject invalid email format', () => {
      const result = schema.safeParse({
        email: 'invalid-email',
        password: validData.password,
      });
      expect(result.success).toBe(false);
    });

    it('reject invalid password', () => {
      const result = schema.safeParse({
        email: validData.email,
        password: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });

  it('include error messages from nested schemas', () => {
    const result = schema.safeParse({ email: '', password: '' });
    expect(result.success).toBe(false);

    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages).toContain('translated_required');
    }
  });

  describe('extra fields handling', () => {
    const dataWithExtraFields = {
      ...validData,
      extraField: 'should not be here',
    };

    it('strip extra fields by default', () => {
      const result = schema.safeParse(dataWithExtraFields);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
        expect(result.data).not.toHaveProperty('extraField');
      }
    });

    it('reject extra fields in strict mode', () => {
      const strictSchema = loginSchema(mockT).strict();
      const result = strictSchema.safeParse(dataWithExtraFields);
      expect(result.success).toBe(false);
    });
  });
});
