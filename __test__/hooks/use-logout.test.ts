import { act, renderHook } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { useLogout } from '@/hooks/use-logout';

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/ui/sonner', () => ({
  useToast: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useLogout', () => {
  const mockLogout = jest.fn();
  const mockToastSuccess = jest.fn();
  const mockToastError = jest.fn();
  const mockPush = jest.fn();
  const mockT = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useToast as jest.Mock).mockReturnValue({
      toastSuccess: mockToastSuccess,
      toastError: mockToastError,
    });
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        success: 'Logout successful',
        'error-with-msg': 'Error:',
        'error-no-msg': 'Logout failed',
        btn: 'Retry',
      };
      return translations[key] || key;
    });
  });

  it('show success toast on successful logout', async () => {
    mockLogout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockToastSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastSuccess).toHaveBeenCalledWith('Logout successful');
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('show error toast with message when logout fails with Error', async () => {
    const error = new Error('Network error');
    mockLogout.mockRejectedValue(error);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockToastError).toHaveBeenCalledTimes(1);
    expect(mockToastError.mock.calls[0][0]).toBe(
      'error-with-msg Network error'
    );
    expect(mockToastError.mock.calls[0][1]?.action?.label).toBe('Retry');
    expect(typeof mockToastError.mock.calls[0][1]?.action?.onClick).toBe(
      'function'
    );
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('show error toast without message when logout fails with non-Error', async () => {
    mockLogout.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockToastError).toHaveBeenCalledTimes(1);
    expect(mockToastError.mock.calls[0][0]).toBe('Logout failed');
    expect(mockToastError.mock.calls[0][1]?.action?.label).toBe('Retry');
    expect(typeof mockToastError.mock.calls[0][1]?.action?.onClick).toBe(
      'function'
    );
  });

  it('show error toast with empty error message', async () => {
    const error = new Error('');
    mockLogout.mockRejectedValue(error);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockToastError.mock.calls[0][0]).toBe('error-with-msg ');
    expect(mockToastError.mock.calls[0][1]?.action?.label).toBe('Retry');
    expect(typeof mockToastError.mock.calls[0][1]?.action?.onClick).toBe(
      'function'
    );
  });

  it('execute retry action from toast and show success toast', async () => {
    const error = new Error('Temporary error');
    mockLogout.mockRejectedValueOnce(error).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    const retryAction = mockToastError.mock.calls[0][1]?.action?.onClick;
    expect(typeof retryAction).toBe('function');

    await act(async () => {
      retryAction();
    });

    expect(mockToastSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastSuccess).toHaveBeenCalledWith('Logout successful');
    expect(mockToastError).toHaveBeenCalledTimes(1);
  });

  it('execute retry action from toast and show error toast again on failure', async () => {
    const error = new Error('Permanent error');
    mockLogout.mockRejectedValue(error);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });
    const retryAction = mockToastError.mock.calls[0][1]?.action?.onClick;
    expect(typeof retryAction).toBe('function');

    await act(async () => {
      retryAction();
    });

    expect(mockToastError).toHaveBeenCalledTimes(2);
    expect(mockToastError).toHaveBeenCalledWith(
      'Retry logout error:',
      expect.objectContaining({
        additionalMessage: 'Permanent error',
        duration: 3000,
      })
    );

    consoleErrorSpy.mockRestore();
  });
  it('not show success toast if retry fails', async () => {
    const error = new Error('Retry error');
    mockLogout.mockRejectedValue(error);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    const retryAction = mockToastError.mock.calls[0][1]?.action?.onClick;
    expect(typeof retryAction).toBe('function');

    await act(async () => {
      retryAction();
    });

    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockToastError).toHaveBeenCalledTimes(2);
  });

  it('have correct toast action button label', async () => {
    const error = new Error('Test error');
    mockLogout.mockRejectedValue(error);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    const actionLabel = mockToastError.mock.calls[0][1]?.action?.label;
    expect(actionLabel).toBe('Retry');
    expect(mockT).toHaveBeenCalledWith('btn');
  });

  it('call toast with correct parameters structure', async () => {
    const error = new Error('Structure error');
    mockLogout.mockRejectedValue(error);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    const [message, options] = mockToastError.mock.calls[0];

    expect(message).toBe('error-with-msg Structure error');
    expect(options?.action?.label).toBe('Retry');
    expect(typeof options?.action?.onClick).toBe('function');
  });

  it('handle handleLogoutSync method', async () => {
    mockLogout.mockResolvedValue(undefined);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      result.current.handleLogoutSync();
    });

    expect(mockToastSuccess).toHaveBeenCalledWith('Logout successful');
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('verify retry function calls logout again', async () => {
    const error = new Error('Test retry');
    mockLogout.mockRejectedValueOnce(error).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    const retryAction = mockToastError.mock.calls[0][1]?.action?.onClick;
    expect(typeof retryAction).toBe('function');

    expect(mockLogout).toHaveBeenCalledTimes(1);

    await act(async () => {
      retryAction();
    });

    expect(mockLogout).toHaveBeenCalledTimes(2);
  });
});
