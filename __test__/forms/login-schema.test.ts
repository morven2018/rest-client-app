import { loginSchema } from '@/components/layout/form/schemas/login-schema';

const mockT = (key: string) => `translated_${key}`;

describe('loginSchema', () => {
  const schema = loginSchema(mockT);

  it('validate correct login data', () => {
    const validData = {
      email: 'user@example.com',
      password: 'ValidPassword123!',
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty object', () => {
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('reject missing email', () => {
    const invalidData = {
      password: 'ValidPassword123!',
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('reject missing password', () => {
    const invalidData = {
      email: 'user@example.com',
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('reject invalid email format', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'ValidPassword123!',
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('reject invalid password', () => {
    const invalidData = {
      email: 'user@example.com',
      password: 'weak',
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('include error messages from nested schemas', () => {
    const invalidData = {
      email: '',
      password: '',
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages).toContain('translated_required');
      expect(errorMessages).toContain('translated_required');
    }
  });

  it('reject extra fields', () => {
    const dataWithExtraFields = {
      email: 'user@example.com',
      password: 'ValidPassword123!',
      extraField: 'should not be here',
    };

    const result = schema.safeParse(dataWithExtraFields);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        email: 'user@example.com',
        password: 'ValidPassword123!',
      });
      expect(result.data).not.toHaveProperty('extraField');
    }
  });

  it('work with strict mode if enabled', () => {
    const strictSchema = loginSchema(mockT).strict();
    const dataWithExtraFields = {
      email: 'user@example.com',
      password: 'ValidPassword123!',
      extraField: 'should cause error',
    };

    const result = strictSchema.safeParse(dataWithExtraFields);
    expect(result.success).toBe(false);
  });
});
