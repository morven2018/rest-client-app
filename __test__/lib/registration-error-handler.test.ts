import { FirebaseError } from 'firebase/app';
import { handleRegistrationError } from '@/lib/error-handlers/registration-error-handler';

const mockT = (key: string): string => {
  const translations: Record<string, string> = {
    error: 'Unknown error occurred',
    'upload-error': 'File upload failed',
  };
  return translations[key] || key;
};

describe('handleRegistrationError', () => {
  test('handle Firebase email-already-in-use error', () => {
    const firebaseError = new FirebaseError(
      'auth/email-already-in-use',
      'Email already in use'
    );

    const result = handleRegistrationError(firebaseError, mockT);

    expect(result).toEqual({
      message: 'Email used',
      code: 'auth/email-already-in-use',
      isEmailInUse: true,
    });
  });

  test('handle other Firebase errors', () => {
    const firebaseError = new FirebaseError(
      'auth/invalid-email',
      'Invalid email address'
    );

    const result = handleRegistrationError(firebaseError, mockT);

    expect(result).toEqual({
      message: 'Unknown error occurred',
      code: 'auth/invalid-email',
    });
  });

  test('handle upload error with Error instance', () => {
    const uploadError = new Error('Upload failed: Network error');

    const result = handleRegistrationError(uploadError, mockT);

    expect(result).toEqual({
      message: 'File upload failed',
      isUploadError: true,
    });
  });

  test('handle generic Error instances', () => {
    const genericError = new Error('Some generic error');

    const result = handleRegistrationError(genericError, mockT);

    expect(result).toEqual({
      message: 'Unknown error occurred',
    });
  });

  test('handle string errors', () => {
    const stringError = 'Something went wrong';

    const result = handleRegistrationError(stringError, mockT);

    expect(result).toEqual({
      message: 'Unknown error occurred',
    });
  });

  test('handle null error', () => {
    const result = handleRegistrationError(null, mockT);

    expect(result).toEqual({
      message: 'Unknown error occurred',
    });
  });

  test('handle undefined error', () => {
    const result = handleRegistrationError(undefined, mockT);

    expect(result).toEqual({
      message: 'Unknown error occurred',
    });
  });

  test('handle object error with message', () => {
    const objectError = { message: 'Custom error message' };

    const result = handleRegistrationError(objectError, mockT);

    expect(result).toEqual({
      message: 'Unknown error occurred',
    });
  });

  test('handle different Firebase error codes', () => {
    const errorCodes = [
      'auth/weak-password',
      'auth/operation-not-allowed',
      'auth/user-disabled',
      'auth/network-request-failed',
    ];

    errorCodes.forEach((code) => {
      const firebaseError = new FirebaseError(code, 'Firebase error');
      const result = handleRegistrationError(firebaseError, mockT);

      expect(result).toEqual({
        message: 'Unknown error occurred',
        code: code,
      });
    });
  });

  test('use translation function correctly', () => {
    const customT = (key: string): string => `Translated: ${key}`;
    const firebaseError = new FirebaseError(
      'auth/invalid-email',
      'Invalid email'
    );

    const result = handleRegistrationError(firebaseError, customT);

    expect(result).toEqual({
      message: 'Translated: error',
      code: 'auth/invalid-email',
    });
  });

  test('handle upload error with exact match', () => {
    const uploadError = new Error('Upload failed');

    const result = handleRegistrationError(uploadError, mockT);

    expect(result).toEqual({
      message: 'File upload failed',
      isUploadError: true,
    });
  });

  test('not match upload error for similar messages', () => {
    const similarError = new Error('Upload was successful');
    const anotherError = new Error('Failed to download');

    const result1 = handleRegistrationError(similarError, mockT);
    const result2 = handleRegistrationError(anotherError, mockT);

    expect(result1).toEqual({ message: 'Unknown error occurred' });
    expect(result2).toEqual({ message: 'Unknown error occurred' });
  });
});
