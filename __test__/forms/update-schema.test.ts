import { z } from 'zod';
import { updateAccountSchema } from '@/components/layout/form/schemas/update-schema';

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

describe('updateAccountSchema', () => {
  const schema = updateAccountSchema(mockT);

  const validUsername = 'ValidUsername';
  const invalidUsername = 'invalidUsername';
  const shortUsername = 'ab';

  const validAvatar = new File([new ArrayBuffer(100 * 1024)], 'avatar.jpg', {
    type: 'image/jpeg',
  });

  const invalidAvatar = new File(['text content'], 'file.txt', {
    type: 'text/plain',
  });

  const successTestCases = [
    {
      name: 'validate correct update data with both fields',
      data: { username: validUsername, avatar: undefined },
    },
    {
      name: 'validate with avatar file',
      data: { username: validUsername, avatar: validAvatar },
    },
    {
      name: 'validate with only username',
      data: { username: validUsername },
    },
    {
      name: 'validate with only avatar',
      data: { avatar: validAvatar },
    },
    {
      name: 'reject empty object',
      data: {},
    },
    {
      name: 'allow partial updates',
      data: { username: 'NewUsername' },
    },
    {
      name: 'work with empty update',
      data: {},
    },
  ];

  const errorTestCases = [
    {
      name: 'validate username rules',
      data: { username: invalidUsername },
    },
    {
      name: 'validate avatar rules',
      data: { avatar: invalidAvatar },
    },
  ];

  successTestCases.forEach(({ name, data }) => {
    it(name, () => {
      const result = schema.safeParse(data);
      expectValidationSuccess(result);
    });
  });

  errorTestCases.forEach(({ name, data }) => {
    it(name, () => {
      const result = schema.safeParse(data);
      expectValidationError(result);
    });
  });

  it('strip extra fields', () => {
    const dataWithExtraFields = {
      username: validUsername,
      avatar: undefined,
      extraField: 'should be removed',
      anotherField: 'should also be removed',
    };

    const result = schema.safeParse(dataWithExtraFields);
    expectValidationSuccess(result);

    if (result.success) {
      expect(result.data).toEqual({
        username: validUsername,
        avatar: undefined,
      });
      expect(result.data).not.toHaveProperty('extraField');
      expect(result.data).not.toHaveProperty('anotherField');
    }
  });

  it('reject invalid username and avatar together', () => {
    const invalidData = {
      username: shortUsername,
      avatar: invalidAvatar,
    };

    const result = schema.safeParse(invalidData);
    expectValidationError(result);

    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(1);
    }
  });
});
