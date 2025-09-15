import {
  getAuthErrorInfo,
  getErrorInfo,
} from '@/lib/error-handlers/error-message';

describe('getErrorInfo', () => {
  test('handle ApiError with complete error object', () => {
    const apiError = {
      error: {
        code: 404,
        message: 'Not found',
        errors: [
          {
            message: 'Resource not found',
            domain: 'global',
            reason: 'notFound',
          },
        ],
      },
    };

    const result = getErrorInfo(apiError);

    expect(result).toEqual({
      code: 404,
      message: 'Not found',
    });
  });

  test('handle ApiError with missing message', () => {
    const apiError = {
      error: {
        code: 400,
        errors: [
          {
            message: 'Bad request',
            domain: 'global',
          },
        ],
      },
    };

    const result = getErrorInfo(apiError);

    expect(result).toEqual({
      code: 400,
      message: 'Unknown error occurred',
    });
  });

  test('handle object with code and message properties', () => {
    const error = {
      code: 403,
      message: 'Access denied',
    };

    const result = getErrorInfo(error);

    expect(result).toEqual({
      code: 403,
      message: '"Access denied"',
    });
  });

  test('handle object with only message property', () => {
    const error = {
      message: 'Simple error message',
    };

    const result = getErrorInfo(error);

    expect(result).toEqual({
      code: 500,
      message: 'Simple error message',
    });
  });

  test('handle string error', () => {
    const error = 'String error message';

    const result = getErrorInfo(error);

    expect(result).toEqual({
      code: 500,
      message: 'String error message',
    });
  });

  test('should handle null', () => {
    const result = getErrorInfo(null);

    expect(result).toEqual({
      code: 500,
      message: 'Unknown error occurred',
    });
  });

  test('handle undefined', () => {
    const result = getErrorInfo(undefined);

    expect(result).toEqual({
      code: 500,
      message: 'Unknown error occurred',
    });
  });

  test('handle empty object', () => {
    const result = getErrorInfo({});

    expect(result).toEqual({
      code: 500,
      message: 'Unknown error occurred',
    });
  });

  test('handle non-object with message property', () => {
    const error = {
      message: 123,
    };

    const result = getErrorInfo(error);

    expect(result).toEqual({
      code: 500,
      message: 'Unknown error occurred',
    });
  });
});

describe('getAuthErrorInfo', () => {
  test('detect invalid credentials', () => {
    const authError = {
      error: {
        code: 400,
        message: 'INVALID_LOGIN_CREDENTIALS',
        errors: [
          {
            message: 'Invalid email or password',
            domain: 'global',
            reason: 'invalid',
          },
        ],
      },
    };

    const result = getAuthErrorInfo(authError);

    expect(result).toEqual({
      code: 400,
      message: 'INVALID_LOGIN_CREDENTIALS',
      isInvalidCredentials: true,
      details: [
        {
          message: 'Invalid email or password',
          domain: 'global',
          reason: 'invalid',
        },
      ],
    });
  });

  test('not detect invalid credentials for different error', () => {
    const authError = {
      error: {
        code: 401,
        message: 'UNAUTHORIZED',
        errors: [
          {
            message: 'Token expired',
            domain: 'global',
            reason: 'expired',
          },
        ],
      },
    };

    const result = getAuthErrorInfo(authError);

    expect(result).toEqual({
      code: 401,
      message: 'UNAUTHORIZED',
      isInvalidCredentials: false,
      details: [
        {
          message: 'Token expired',
          domain: 'global',
          reason: 'expired',
        },
      ],
    });
  });

  test('handle non-ApiError objects', () => {
    const error = {
      code: 400,
      message: 'INVALID_LOGIN_CREDENTIALS',
    };

    const result = getAuthErrorInfo(error);

    expect(result).toEqual({
      code: 400,
      message: '"INVALID_LOGIN_CREDENTIALS"',
      isInvalidCredentials: false,
      details: undefined,
    });
  });

  test('handle string errors', () => {
    const error = 'Authentication failed';

    const result = getAuthErrorInfo(error);

    expect(result).toEqual({
      code: 500,
      message: 'Authentication failed',
      isInvalidCredentials: false,
      details: undefined,
    });
  });

  test('handle errors without details', () => {
    const error = {
      error: {
        code: 400,
        message: 'Some auth error',
      },
    };

    const result = getAuthErrorInfo(error);

    expect(result).toEqual({
      code: 400,
      message: 'Some auth error',
      isInvalidCredentials: false,
      details: undefined,
    });
  });
});
