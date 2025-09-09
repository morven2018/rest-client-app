import { FirebaseError } from 'firebase/app';

export interface RegistrationError {
  message: string;
  code?: string;
  isEmailInUse?: boolean;
  isWeakPassword?: boolean;
  isInvalidEmail?: boolean;
  isUploadError?: boolean;
}

export const handleRegistrationError = (
  error: unknown,
  t: (key: string) => string
): RegistrationError => {
  if (error instanceof FirebaseError) {
    return error.code === 'auth/email-already-in-use'
      ? {
          message: 'Email used',
          code: error.code,
          isEmailInUse: true,
        }
      : {
          message: t('error'),
          code: error.code,
        };
  }

  if (error instanceof Error && error.message.includes('Upload failed')) {
    return {
      message: t('upload-error'),
      isUploadError: true,
    };
  }

  return {
    message: t('error'),
  };
};
