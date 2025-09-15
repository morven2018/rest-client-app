import {
  TokenVerificationResponse,
  isTokenExpired,
  verifyToken,
} from '@/lib/api/token-verification';

global.fetch = jest.fn();
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';

describe('verifyToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('return valid response from backend API', async () => {
    const mockResponse: TokenVerificationResponse = {
      isValid: true,
      user: {
        uid: '123',
        email: 'test@example.com',
        emailVerified: true,
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await verifyToken('valid-token');

    expect(fetch).toHaveBeenCalledWith('/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid-token',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  test('fall back to local verification when backend fails', async () => {
    const mockBackendResponse = {
      ok: false,
      status: 500,
    };

    const mockLocalResponse: TokenVerificationResponse = {
      isValid: true,
      user: {
        uid: '123',
        email: 'test@example.com',
        emailVerified: true,
      },
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce(mockBackendResponse)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          users: [
            {
              localId: '123',
              email: 'test@example.com',
              emailVerified: true,
            },
          ],
        }),
      });

    const result = await verifyToken('valid-token');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockLocalResponse);
  });

  test('handle backend network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await verifyToken('valid-token');

    expect(result).toEqual({
      isValid: false,
      error: 'Verification failed',
    });
  });
});

describe('verifyTokenLocally', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('return valid response for valid token', async () => {
    const mockResponse = {
      users: [
        {
          localId: '123',
          email: 'test@example.com',
          emailVerified: true,
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await verifyToken('valid-token');

    expect(fetch).toHaveBeenCalledWith('/api/auth/verify-token', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-token',
        'Content-Type': 'application/json',
      },
    });
  });

  test('handle network error in local verification', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await verifyToken('valid-token');

    expect(result).toEqual({
      isValid: false,
      error: 'Verification failed',
    });
  });

  test('handle non-ok response from Firebase', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const result = await verifyToken('invalid-token');

    expect(result).toEqual({
      isValid: false,
      error: 'Verification failed',
    });
  });
});

describe('isTokenExpired', () => {
  test('return true for expired token', () => {
    const expiredToken = createTestToken(Date.now() - 1000 * 60 * 60);
    expect(isTokenExpired(expiredToken)).toBe(true);
  });

  test('return false for valid token', () => {
    const validToken = createTestToken(Date.now() + 1000 * 60 * 60);
    expect(isTokenExpired(validToken)).toBe(false);
  });

  test('return true for invalid token format', () => {
    expect(isTokenExpired('invalid.token.format')).toBe(true);
  });

  test('return true for malformed token', () => {
    expect(isTokenExpired('not.a.jwt.token')).toBe(true);
  });

  test('return true for empty token', () => {
    expect(isTokenExpired('')).toBe(true);
  });
});

function createTestToken(expirationTime: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(expirationTime / 1000),
      iat: Math.floor(Date.now() / 1000) - 300,
      sub: '123',
    })
  );
  const signature = 'test-signature';

  return `${header}.${payload}.${signature}`;
}
