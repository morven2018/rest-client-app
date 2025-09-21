import { renderHook } from '@testing-library/react';
import { useAuth } from '@/context/auth/auth-context';
import { useTokenValidity } from '@/hooks/use-token-validity';

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

global.atob = jest.fn();
const mockDateNow = jest.spyOn(Date, 'now');

describe('useTokenValidity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDateNow.mockReturnValue(1000000);
  });

  afterAll(() => {
    mockDateNow.mockRestore();
  });

  it('return false for empty token', () => {
    (useAuth as jest.Mock).mockReturnValue({ authToken: null });

    const { result } = renderHook(() => useTokenValidity());

    expect(result.current.isTokenValid).toBe(false);
    expect(result.current.hasToken).toBe(false);
  });

  it('return false for invalid token format', () => {
    (useAuth as jest.Mock).mockReturnValue({ authToken: 'invalid-token' });
    (atob as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const { result } = renderHook(() => useTokenValidity());

    expect(result.current.isTokenValid).toBe(false);
    expect(result.current.hasToken).toBe(true);
  });

  it('return false for expired token', () => {
    const expiredToken = 'header.payload.signature';
    (useAuth as jest.Mock).mockReturnValue({ authToken: expiredToken });

    (atob as jest.Mock).mockReturnValue(JSON.stringify({ exp: 1 }));
    mockDateNow.mockReturnValue(2000000);

    const { result } = renderHook(() => useTokenValidity());

    expect(result.current.isTokenValid).toBe(false);
    expect(result.current.hasToken).toBe(true);
  });

  it('return true for valid token', () => {
    const validToken = 'header.payload.signature';
    (useAuth as jest.Mock).mockReturnValue({ authToken: validToken });

    (atob as jest.Mock).mockReturnValue(JSON.stringify({ exp: 1000 }));
    mockDateNow.mockReturnValue(500000);

    const { result } = renderHook(() => useTokenValidity());

    expect(result.current.isTokenValid).toBe(true);
    expect(result.current.hasToken).toBe(true);
  });

  it('handle malformed JSON in payload', () => {
    const malformedToken = 'header.payload.signature';
    (useAuth as jest.Mock).mockReturnValue({ authToken: malformedToken });

    (atob as jest.Mock).mockReturnValue('not-json');

    const { result } = renderHook(() => useTokenValidity());

    expect(result.current.isTokenValid).toBe(false);
    expect(result.current.hasToken).toBe(true);
  });

  it('handle token without exp field', () => {
    const tokenWithoutExp = 'header.payload.signature';
    (useAuth as jest.Mock).mockReturnValue({ authToken: tokenWithoutExp });

    (atob as jest.Mock).mockReturnValue(JSON.stringify({ someField: 'value' }));

    const { result } = renderHook(() => useTokenValidity());

    expect(result.current.isTokenValid).toBe(false);
    expect(result.current.hasToken).toBe(true);
  });
});
