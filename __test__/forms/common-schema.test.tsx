import {
  avatarSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
} from '@/components/layout/form/schemas/common-schemas';

const mockT = (key: string) => `translated_${key}`;

describe('Validation Schemas', () => {
  describe('usernameSchema', () => {
    const schema = usernameSchema(mockT);

    it('allow empty username', () => {
      const result = schema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('allow valid username', () => {
      const result = schema.safeParse('ValidUsername123');
      expect(result.success).toBe(true);
    });

    it('reject username without first capital letter', () => {
      const result = schema.safeParse('invalidUsername');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'translated_name-uppercase'
        );
      }
    });

    it('reject username if it too short', () => {
      const result = schema.safeParse('Ab');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_name-length');
      }
    });

    it('reject username if it too long', () => {
      const result = schema.safeParse('A'.repeat(21));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_name-length');
      }
    });

    it('reject username with invalid characters', () => {
      const result = schema.safeParse('Invalid@Name');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_name-format');
      }
    });

    it('allow Russian characters', () => {
      const result = schema.safeParse('ЧтоТо');
      expect(result.success).toBe(true);
    });

    it('allow spaces and underscores', () => {
      const result = schema.safeParse('Valid User_Name');
      expect(result.success).toBe(true);
    });
  });

  describe('avatarSchema', () => {
    const schema = avatarSchema(mockT);

    it('allow empty avatar', () => {
      const result = schema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('reject non-image files', () => {
      const textFile = new File(['text content'], 'file.txt', {
        type: 'text/plain',
      });
      const result = schema.safeParse(textFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_image-only');
      }
    });

    it('reject files larger than 500KB', () => {
      const largeFile = new File([new ArrayBuffer(600 * 1024)], 'image.jpg', {
        type: 'image/jpeg',
      });
      const result = schema.safeParse(largeFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_image-size');
      }
    });

    it('reject files that would be too long in base64', () => {
      const file = new File([new ArrayBuffer(600 * 1024)], 'image.jpg', {
        type: 'image/jpeg',
      });
      const result = schema.safeParse(file);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_image-size');
      }
    });

    it('allow valid image files', () => {
      const validFile = new File([new ArrayBuffer(100 * 1024)], 'image.jpg', {
        type: 'image/jpeg',
      });
      const result = schema.safeParse(validFile);
      expect(result.success).toBe(true);
    });
  });

  describe('passwordSchema', () => {
    const schema = passwordSchema(mockT);

    it('reject empty password', () => {
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_required');
      }
    });

    it('reject password without digits', () => {
      const result = schema.safeParse('Password!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_digit');
      }
    });

    it('reject password without uppercase letters', () => {
      const result = schema.safeParse('password123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_uppercase');
      }
    });

    it('reject password without lowercase letters', () => {
      const result = schema.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_lowercase');
      }
    });

    it('reject password without special characters', () => {
      const result = schema.safeParse('Password123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_special');
      }
    });

    it('reject password if it too short', () => {
      const result = schema.safeParse('Pa1!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_min');
      }
    });

    it('allow valid password', () => {
      const result = schema.safeParse('ValidPassword123!');
      expect(result.success).toBe(true);
    });

    it('allow password with Unicode special characters', () => {
      const result = schema.safeParse('Password123§');
      expect(result.success).toBe(true);
    });
  });

  describe('emailSchema', () => {
    const schema = emailSchema(mockT);

    it('reject empty email', () => {
      const result = schema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_required');
      }
    });

    it('reject invalid email format', () => {
      const result = schema.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_email');
      }
    });

    it('reject email without @ symbol', () => {
      const result = schema.safeParse('user.example.com');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_email');
      }
    });

    it('reject email without domain', () => {
      const result = schema.safeParse('user@');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('translated_email');
      }
    });

    it('allow valid email', () => {
      const result = schema.safeParse('user@example.com');
      expect(result.success).toBe(true);
    });

    it('allow email with subdomains', () => {
      const result = schema.safeParse('user@sub.example.com');
      expect(result.success).toBe(true);
    });

    it('allow email with special characters', () => {
      const result = schema.safeParse('user.name+tag@example.com');
      expect(result.success).toBe(true);
    });
  });
});
