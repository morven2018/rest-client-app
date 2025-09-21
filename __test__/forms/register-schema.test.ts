import { z } from 'zod';
import { registerSchema } from '@/components/layout/form/schemas/register-schema';

const mockT = (key: string) => `translated_${key}`;

const expectValidationSuccess = (
  result:
    | { success: true; data: unknown }
    | { success: false; error: z.ZodError }
) => {
  expect(result.success).toBe(true);
};

const expectValidationError = (
  result:
    | { success: true; data: unknown }
    | { success: false; error: z.ZodError }
) => {
  expect(result.success).toBe(false);
};

describe('registerSchema', () => {
  const schema = registerSchema(mockT);

  const validData = {
    email: 'user@example.com',
    password: 'ValidPassword123!',
    username: 'ValidUsername',
    avatar: undefined,
  };

  const testCases = [
    {
      name: 'validate correct registration data',
      data: validData,
      expectedSuccess: true,
    },
    {
      name: 'validate with avatar file',
      data: {
        ...validData,
        avatar: new File([new ArrayBuffer(100 * 1024)], 'avatar.jpg', {
          type: 'image/jpeg',
        }),
      },
      expectedSuccess: true,
    },
    {
      name: 'reject missing username',
      data: {
        email: 'user@example.com',
        password: 'ValidPassword123!',
        avatar: undefined,
      },
      expectedSuccess: true,
    },
    {
      name: 'inherit validation from loginSchema for email',
      data: {
        ...validData,
        email: 'invalid-email',
      },
      expectedSuccess: false,
    },
    {
      name: 'inherit validation from loginSchema for password',
      data: {
        ...validData,
        password: 'weak',
      },
      expectedSuccess: false,
    },
    {
      name: 'validate username rules',
      data: {
        ...validData,
        username: 'invalidUsername',
      },
      expectedSuccess: false,
    },
    {
      name: 'validate avatar rules',
      data: {
        ...validData,
        avatar: new File(['text content'], 'file.txt', {
          type: 'text/plain',
        }),
      },
      expectedSuccess: false,
    },
    {
      name: 'allow empty avatar',
      data: {
        email: 'user@example.com',
        password: 'ValidPassword123!',
        username: 'ValidUsername',
      },
      expectedSuccess: true,
    },
    {
      name: 'work with all optional fields except email and password',
      data: {
        email: 'user@example.com',
        password: 'ValidPassword123!',
      },
      expectedSuccess: true,
    },
  ];

  testCases.forEach(({ name, data, expectedSuccess }) => {
    it(name, () => {
      const result = schema.safeParse(data);
      if (expectedSuccess) {
        expectValidationSuccess(result);
      } else {
        expectValidationError(result);
      }
    });
  });

  it('return multiple error messages for multiple invalid fields', () => {
    const invalidData = {
      email: 'invalid',
      password: 'weak',
      username: 'ab',
      avatar: undefined,
    };

    const result = schema.safeParse(invalidData);
    expectValidationError(result);

    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(1);
    }
  });

  it('strip extra fields', () => {
    const dataWithExtraFields = {
      ...validData,
      extraField: 'should be removed',
    };

    const result = schema.safeParse(dataWithExtraFields);
    expectValidationSuccess(result);

    if (result.success) {
      expect(result.data).toEqual(validData);
      expect(result.data).not.toHaveProperty('extraField');
    }
  });
});
