import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { useAuthForm } from '@/hooks/use-auth-form';

jest.mock('@/context/auth/auth-context');
jest.mock('next/navigation');
jest.mock('@/components/ui/sonner');
jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    useForm: jest.fn(),
  };
});
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(() => jest.fn()),
}));

const testSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const mockReactHookForm = { useForm };

describe('useAuthForm', () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();
  const mockRouterPush = jest.fn();
  const mockToastError = jest.fn();
  const mockToastSuccess = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      authToken: null,
      currentUser: null,
      login: mockLogin,
      register: mockRegister,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    const mockUseForm = jest.fn().mockReturnValue({
      handleSubmit: (callback: (data: unknown) => void) => () => callback({}),
      formState: { errors: {}, isValid: false },
      register: jest.fn(),
      watch: jest.fn(),
      getValues: jest.fn(),
      setValue: jest.fn(),
      reset: jest.fn(),
      trigger: jest.fn(),
    });

    jest.spyOn(mockReactHookForm, 'useForm').mockImplementation(mockUseForm);

    (useToast as jest.Mock).mockReturnValue({
      toastError: mockToastError,
      toastSuccess: mockToastSuccess,
      toastNote: jest.fn(),
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('set and clear auth error', () => {
    const { result } = renderHook(() => useAuthForm({ schema: testSchema }));

    act(() => {
      result.current.setAuthError('Test error');
    });

    expect(result.current.authError).toBe('Test error');

    act(() => {
      result.current.clearAuthError();
    });

    expect(result.current.authError).toBe('');
  });

  it('call toast functions', () => {
    const { result } = renderHook(() => useAuthForm({ schema: testSchema }));

    act(() => {
      result.current.toastError('Error message');
    });

    expect(mockToastError).toHaveBeenCalledWith('Error message');

    act(() => {
      result.current.toastSuccess('Success message', {
        action: { label: 'Ok', onClick: jest.fn() },
      });
    });
  });

  it('redirect if user is authenticated and redirectOnAuth is true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      authToken: 'test-token',
      currentUser: { uid: '123' },
    });

    renderHook(() =>
      useAuthForm({
        schema: testSchema,
        redirectOnAuth: true,
      })
    );

    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('not redirect if redirectOnAuth is false', () => {
    (useAuth as jest.Mock).mockReturnValue({
      authToken: 'test-token',
      currentUser: { uid: '123' },
    });

    renderHook(() =>
      useAuthForm({
        schema: testSchema,
        redirectOnAuth: false,
      })
    );

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('return router instance', () => {
    const { result } = renderHook(() => useAuthForm({ schema: testSchema }));

    expect(result.current.router.push).toBe(mockRouterPush);
  });
});
