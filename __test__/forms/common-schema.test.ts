import z from 'zod';

import {
  avatarSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
} from '@/components/layout/form/schemas/common-schemas';

const mockT = (key: string) => `translated_${key}`;

const expectValidationSuccess = <T>(
  result: { success: true; data: T } | { success: false; error: z.ZodError }
) => {
  expect(result.success).toBe(true);
};

const expectValidationError = (
  result:
    | { success: true; data: unknown }
    | { success: false; error: z.ZodError },
  expectedMessage: string
) => {
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0].message).toBe(expectedMessage);
  }
};

const runTestCases = (
  schema: z.ZodTypeAny,
  testCases: Array<{
    name: string;
    value: string | undefined | File;
    expectedSuccess: boolean;
    expectedMessage?: string;
  }>
) => {
  testCases.forEach(({ name, value, expectedSuccess, expectedMessage }) => {
    it(name, () => {
      const result = schema.safeParse(value);
      if (expectedSuccess) {
        expectValidationSuccess(result);
      } else {
        expectValidationError(result, expectedMessage!);
      }
    });
  });
};

describe('Validation Schemas', () => {
  describe('usernameSchema', () => {
    const schema = usernameSchema(mockT);

    runTestCases(schema, [
      {
        name: 'allow empty username',
        value: undefined,
        expectedSuccess: true,
      },
      {
        name: 'allow valid username',
        value: 'ValidUsername123',
        expectedSuccess: true,
      },
      {
        name: 'reject username without first capital letter',
        value: 'invalidUsername',
        expectedSuccess: false,
        expectedMessage: 'translated_name-uppercase',
      },
      {
        name: 'reject username if it too short',
        value: 'Ab',
        expectedSuccess: false,
        expectedMessage: 'translated_name-length',
      },
      {
        name: 'reject username if it too long',
        value: 'A'.repeat(21),
        expectedSuccess: false,
        expectedMessage: 'translated_name-length',
      },
      {
        name: 'reject username with invalid characters',
        value: 'Invalid@Name',
        expectedSuccess: false,
        expectedMessage: 'translated_name-format',
      },
      {
        name: 'allow Russian characters',
        value: 'ЧтоТо',
        expectedSuccess: true,
      },
      {
        name: 'allow spaces and underscores',
        value: 'Valid User_Name',
        expectedSuccess: true,
      },
    ]);
  });

  describe('avatarSchema', () => {
    const schema = avatarSchema(mockT);

    runTestCases(schema, [
      {
        name: 'allow empty avatar',
        value: undefined,
        expectedSuccess: true,
      },
      {
        name: 'reject non-image files',
        value: new File(['text content'], 'file.txt', { type: 'text/plain' }),
        expectedSuccess: false,
        expectedMessage: 'translated_image-only',
      },
      {
        name: 'reject files larger than 500KB',
        value: new File([new ArrayBuffer(600 * 1024)], 'image.jpg', {
          type: 'image/jpeg',
        }),
        expectedSuccess: false,
        expectedMessage: 'translated_image-size',
      },
      {
        name: 'reject files that would be too long in base64',
        value: new File([new ArrayBuffer(600 * 1024)], 'image.jpg', {
          type: 'image/jpeg',
        }),
        expectedSuccess: false,
        expectedMessage: 'translated_image-size',
      },
      {
        name: 'allow valid image files',
        value: new File([new ArrayBuffer(100 * 1024)], 'image.jpg', {
          type: 'image/jpeg',
        }),
        expectedSuccess: true,
      },
    ]);
  });

  describe('passwordSchema', () => {
    const schema = passwordSchema(mockT);

    runTestCases(schema, [
      {
        name: 'reject empty password',
        value: '',
        expectedSuccess: false,
        expectedMessage: 'translated_required',
      },
      {
        name: 'reject password without digits',
        value: 'Password!',
        expectedSuccess: false,
        expectedMessage: 'translated_digit',
      },
      {
        name: 'reject password without uppercase letters',
        value: 'password123!',
        expectedSuccess: false,
        expectedMessage: 'translated_uppercase',
      },
      {
        name: 'reject password without lowercase letters',
        value: 'PASSWORD123!',
        expectedSuccess: false,
        expectedMessage: 'translated_lowercase',
      },
      {
        name: 'reject password without special characters',
        value: 'Password123',
        expectedSuccess: false,
        expectedMessage: 'translated_special',
      },
      {
        name: 'reject password if it too short',
        value: 'Pa1!',
        expectedSuccess: false,
        expectedMessage: 'translated_min',
      },
      {
        name: 'allow valid password',
        value: 'ValidPassword123!',
        expectedSuccess: true,
      },
      {
        name: 'allow password with Unicode special characters',
        value: 'Password123§',
        expectedSuccess: true,
      },
    ]);
  });

  describe('emailSchema', () => {
    const schema = emailSchema(mockT);

    runTestCases(schema, [
      {
        name: 'reject empty email',
        value: '',
        expectedSuccess: false,
        expectedMessage: 'translated_required',
      },
      {
        name: 'reject invalid email format',
        value: 'invalid-email',
        expectedSuccess: false,
        expectedMessage: 'translated_email',
      },
      {
        name: 'reject email without @ symbol',
        value: 'user.example.com',
        expectedSuccess: false,
        expectedMessage: 'translated_email',
      },
      {
        name: 'reject email without domain',
        value: 'user@',
        expectedSuccess: false,
        expectedMessage: 'translated_email',
      },
      {
        name: 'allow valid email',
        value: 'user@example.com',
        expectedSuccess: true,
      },
      {
        name: 'allow email with subdomains',
        value: 'user@sub.example.com',
        expectedSuccess: true,
      },
      {
        name: 'allow email with special characters',
        value: 'user.name+tag@example.com',
        expectedSuccess: true,
      },
    ]);
  });
});
