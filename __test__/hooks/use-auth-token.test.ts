import { renderHook } from '@testing-library/react';
import { AuthContextType, useAuth } from '@/context/auth/auth-context';
import { useAuthToken } from '@/hooks/use-auth-token';

jest.mock('@/context/auth/auth-context');

describe('useAuthToken', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const createMockAuth = (authToken: string | null): AuthContextType => ({
    authToken,
    currentUser: null,
    login: jest.fn(),
    register: jest.fn(),
    getAvatar: jest.fn(),
    logout: jest.fn(),
    resetPassword: jest.fn(),
    loading: false,
    getTimeSinceSignUp: function (): number {
      throw new Error('Function not implemented.');
    },
    isTokenValid: function (token: string): boolean {
      throw new Error('Function not implemented.');
    },
    updateProfile: function (
      username?: string,
      avatarFile?: File
    ): Promise<void> {
      throw new Error('Function not implemented.');
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('return empty header when authToken is null', () => {
    mockUseAuth.mockReturnValue(createMockAuth(null));

    const { result } = renderHook(() => useAuthToken());

    expect(result.current.getAuthHeader()).toEqual({});
    expect(result.current.hasValidToken()).toBe(false);
    expect(result.current.authToken).toBeNull();
  });

  it('return empty header when authToken is empty string', () => {
    mockUseAuth.mockReturnValue(createMockAuth(''));

    const { result } = renderHook(() => useAuthToken());

    expect(result.current.getAuthHeader()).toEqual({});
    expect(result.current.hasValidToken()).toBe(false);
    expect(result.current.authToken).toBe('');
  });

  it('return proper auth header when authToken exists', () => {
    const testToken = 'test-token-123';
    mockUseAuth.mockReturnValue(createMockAuth(testToken));

    const { result } = renderHook(() => useAuthToken());

    expect(result.current.getAuthHeader()).toEqual({
      Authorization: `Bearer ${testToken}`,
      'Content-Type': 'application/json',
    });
    expect(result.current.hasValidToken()).toBe(true);
    expect(result.current.authToken).toBe(testToken);
  });

  it('include Content-Type in header when token exists', () => {
    const testToken = 'test-token';
    mockUseAuth.mockReturnValue(createMockAuth(testToken));

    const { result } = renderHook(() => useAuthToken());
    const headers = result.current.getAuthHeader();

    expect(headers).toHaveProperty('Content-Type', 'application/json');
    expect(headers).toHaveProperty('Authorization', `Bearer ${testToken}`);
  });

  it('not include Content-Type when no token exists', () => {
    mockUseAuth.mockReturnValue(createMockAuth(null));

    const { result } = renderHook(() => useAuthToken());
    const headers = result.current.getAuthHeader();

    expect(headers).not.toHaveProperty('Content-Type');
    expect(headers).not.toHaveProperty('Authorization');
  });

  it('re-render when authToken changes', () => {
    const initialToken = 'initial-token';
    const updatedToken = 'updated-token';

    mockUseAuth.mockReturnValue(createMockAuth(initialToken));

    const { result, rerender } = renderHook(() => useAuthToken());

    mockUseAuth.mockReturnValue(createMockAuth(updatedToken));
    rerender();

    expect(result.current.authToken).toBe(updatedToken);
    expect(result.current.getAuthHeader()).toEqual({
      Authorization: `Bearer ${updatedToken}`,
      'Content-Type': 'application/json',
    });
    expect(result.current.hasValidToken()).toBe(true);
  });
});
