import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginFormData } from '@/components/layout/form/form-types';
import { LoginForm } from '@/components/layout/form/login-form';
import { useAuth } from '@/context/auth/auth-context';
import { useAuthForm } from '@/hooks/use-auth-form';
import { useLogout } from '@/hooks/use-logout';
import { getAuthErrorInfo } from '@/lib/error-handlers/error-message';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace) => {
    const translations: Record<string, Record<string, string>> = {
      Login: {
        password: 'Password',
        placeholder: 'Enter your password',
        btn: 'Sign In',
        success: 'Login successful!',
        'logout-btn': 'Logout',
        error: 'Error occurred:',
        'no-user': 'Invalid email or password',
        'retry-btn': 'Try Again',
      },
      ValidationErrors: {
        required: 'Field is required',
        invalid_email: 'Please enter a valid email',
      },
    };
    return (key: string) => translations[namespace]?.[key] || key;
  }),
}));

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-auth-form', () => ({
  useAuthForm: jest.fn(),
}));

jest.mock('@/hooks/use-logout', () => ({
  useLogout: jest.fn(),
}));

jest.mock('@/lib/error-handlers/error-message', () => ({
  getAuthErrorInfo: jest.fn(),
}));

jest.mock('@/components/layout/form/form-field', () => ({
  FormField: jest.fn(({ name, label, placeholder, type, onFieldChange }) => (
    <div data-testid={`field-${name}`}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        data-testid={`input-${name}`}
        onChange={onFieldChange}
      />
    </div>
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, disabled, type, ...props }) => (
    <button
      type={type}
      disabled={disabled}
      data-testid="login-button"
      {...props}
    >
      {children}
    </button>
  )),
}));

jest.mock('@/components/layout/form/schemas/login-schema', () => ({
  loginSchema: jest.fn(() => ({
    validate: jest.fn(),
  })),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockHandleLogoutSync = jest.fn();
  const mockSetAuthError = jest.fn();
  const mockClearAuthError = jest.fn();
  const mockToastSuccess = jest.fn();
  const mockToastError = jest.fn();
  const mockRouterPush = jest.fn();
  const mockTrigger = jest.fn();

  const mockHandleSubmit =
    (onSubmit: (data: LoginFormData) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ email: 'test@example.com', password: 'password123' });
    };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    (useLogout as jest.Mock).mockReturnValue({
      handleLogoutSync: mockHandleLogoutSync,
    });

    (useAuthForm as jest.Mock).mockReturnValue({
      form: {
        control: {},
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: {},
          isSubmitting: false,
          isValid: true,
        },
        trigger: mockTrigger,
      },
      setAuthError: mockSetAuthError,
      clearAuthError: mockClearAuthError,
      toastSuccess: mockToastSuccess,
      toastError: mockToastError,
      router: {
        push: mockRouterPush,
      },
    });

    (getAuthErrorInfo as jest.Mock).mockReturnValue({
      isInvalidCredentials: false,
      message: 'Test error message',
    });
  });

  it('render login form with all fields', () => {
    render(<LoginForm />);

    expect(screen.getByTestId('field-email')).toBeInTheDocument();
    expect(screen.getByTestId('field-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toHaveTextContent('Sign In');
  });

  it('call login with correct credentials on form submission', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(<LoginForm />);

    const form = screen.getByTestId('login-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('handle successful login', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(<LoginForm />);

    const form = screen.getByTestId('login-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSetAuthError).toHaveBeenCalledWith('');
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Login successful!',
        expect.objectContaining({
          action: expect.objectContaining({
            label: 'Logout',
          }),
        })
      );

      const action = mockToastSuccess.mock.calls[0][1]?.action;
      expect(action?.onClick).toBeInstanceOf(Function);

      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
  });

  it('handle invalid credentials error', async () => {
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValueOnce(error);

    (getAuthErrorInfo as jest.Mock).mockReturnValueOnce({
      isInvalidCredentials: true,
      message: 'auth/invalid-credential',
    });

    render(<LoginForm />);

    const form = screen.getByTestId('login-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Invalid email or password');
      expect(mockSetAuthError).toHaveBeenCalledWith('error');
    });
  });

  it('handle other authentication errors', async () => {
    const error = new Error('Network error');
    mockLogin.mockRejectedValueOnce(error);

    (getAuthErrorInfo as jest.Mock).mockReturnValueOnce({
      isInvalidCredentials: false,
      message: 'Network error',
    });

    render(<LoginForm />);

    const form = screen.getByTestId('login-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Error occurred: Network error',
        expect.objectContaining({
          action: expect.objectContaining({
            label: 'Try Again',
          }),
        })
      );

      const action = mockToastError.mock.calls[0][1]?.action;
      expect(action?.onClick).toBeInstanceOf(Function);

      expect(mockSetAuthError).toHaveBeenCalledWith('error');
    });
  });

  it('clear auth error when field changes', () => {
    render(<LoginForm />);

    const emailInput = screen.getByTestId('input-email');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

    expect(mockClearAuthError).toHaveBeenCalled();
  });

  it('disable button when form is invalid or submitting', () => {
    (useAuthForm as jest.Mock).mockReturnValueOnce({
      form: {
        control: {},
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: { email: { message: 'Email is required' } },
          isSubmitting: false,
          isValid: false,
        },
        trigger: mockTrigger,
      },
      setAuthError: mockSetAuthError,
      clearAuthError: mockClearAuthError,
      toastSuccess: mockToastSuccess,
      toastError: mockToastError,
      router: {
        push: mockRouterPush,
      },
    });

    render(<LoginForm />);

    expect(screen.getByTestId('login-button')).toBeDisabled();
  });

  it('disable button when form is submitting', () => {
    (useAuthForm as jest.Mock).mockReturnValueOnce({
      form: {
        control: {},
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: {},
          isSubmitting: true,
          isValid: true,
        },
        trigger: mockTrigger,
      },
      setAuthError: mockSetAuthError,
      clearAuthError: mockClearAuthError,
      toastSuccess: mockToastSuccess,
      toastError: mockToastError,
      router: {
        push: mockRouterPush,
      },
    });

    render(<LoginForm />);

    expect(screen.getByTestId('login-button')).toBeDisabled();
  });

  it('call logout if success toast action is clicked', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    let logoutAction: () => void = () => {};
    mockToastSuccess.mockImplementation((message, options) => {
      logoutAction = options.action.onClick;
    });

    render(<LoginForm />);

    const form = screen.getByTestId('login-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalled();
    });

    logoutAction();
    expect(mockHandleLogoutSync).toHaveBeenCalled();
  });
});
