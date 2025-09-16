import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/auth-context';
import { useAuthCheck } from '@/hooks/use-auth-check';

interface StateType {
  authToken: null | string;
  currentUser: null | { uid: string; email: string };
}

jest.mock('@/context/auth/auth-context');
jest.mock('next/navigation');

describe('useAuthCheck', () => {
  const mockRouterPush = jest.fn();
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirect to home when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      authToken: null,
      currentUser: null,
    });

    renderHook(() => useAuthCheck());

    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('not redirect when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      authToken: 'test-token',
      currentUser: { uid: '123', email: 'test@example.com' },
    });

    renderHook(() => useAuthCheck());

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('return correct authentication state when authenticated', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    mockUseAuth.mockReturnValue({
      authToken: 'test-token',
      currentUser: mockUser,
    });

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.authToken).toBe('test-token');
    expect(result.current.currentUser).toEqual(mockUser);
  });

  it('return correct authentication state when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      authToken: null,
      currentUser: null,
    });

    const { result } = renderHook(() => useAuthCheck());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.authToken).toBeNull();
    expect(result.current.currentUser).toBeNull();
  });

  it('redirect when authToken is present but currentUser is null', () => {
    mockUseAuth.mockReturnValue({
      authToken: 'test-token',
      currentUser: null,
    });

    renderHook(() => useAuthCheck());

    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('redirect when currentUser is present but authToken is null', () => {
    mockUseAuth.mockReturnValue({
      authToken: null,
      currentUser: { uid: '123', email: 'test@example.com' },
    });

    renderHook(() => useAuthCheck());

    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('call router.push only once when auth state changes', () => {
    let authState: StateType = {
      authToken: null,
      currentUser: null,
    };

    mockUseAuth.mockImplementation(() => authState);

    const { rerender } = renderHook(() => useAuthCheck());

    expect(mockRouterPush).toHaveBeenCalledTimes(1);

    authState = {
      authToken: 'test-token',
      currentUser: { uid: '123', email: 'test@example.com' },
    };

    rerender();

    expect(mockRouterPush).toHaveBeenCalledTimes(1);

    authState = {
      authToken: null,
      currentUser: null,
    };

    rerender();
    expect(mockRouterPush).toHaveBeenCalledTimes(2);
  });
});
