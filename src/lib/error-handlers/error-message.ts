interface ErrorDetail {
  message: string;
  domain?: string;
  reason?: string;
}

interface ApiError {
  error: {
    code: number;
    message: string;
    errors?: ErrorDetail[];
  };
}

export function getErrorInfo(error: unknown): {
  code: number;
  message: string;
} {
  const defaultError = {
    code: 500,
    message: 'Unknown error occurred',
  };

  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;

    if (apiError.error && typeof apiError.error.code === 'number') {
      return {
        code: apiError.error.code,
        message: apiError.error.message || defaultError.message,
      };
    }
    if (
      'code' in error &&
      typeof error.code === 'number' &&
      'message' in error
    ) {
      return {
        code: error.code,
        message: JSON.stringify(error.message) || defaultError.message,
      };
    }

    if ('message' in error && typeof error.message === 'string') {
      return {
        code: defaultError.code,
        message: error.message,
      };
    }
  }

  if (typeof error === 'string') {
    return {
      code: defaultError.code,
      message: error,
    };
  }

  return defaultError;
}

export function getAuthErrorInfo(error: unknown): {
  code: number;
  message: string;
  isInvalidCredentials: boolean;
  details?: ErrorDetail[];
} {
  const errorInfo = getErrorInfo(error);
  const apiError = error as ApiError;

  const isInvalidCredentials =
    errorInfo.code === 400 && errorInfo.message === 'INVALID_LOGIN_CREDENTIALS';

  return {
    code: errorInfo.code,
    message: errorInfo.message,
    isInvalidCredentials,
    details: apiError.error?.errors,
  };
}
