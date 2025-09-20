import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { RegisterForm } from '@/components/layout/form/register-form';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { useAuthForm } from '@/hooks/use-auth-form';
import { useLogout } from '@/hooks/use-logout';
import { useRouter } from '@/i18n/navigation';
import { handleRegistrationError } from '@/lib/error-handlers/registration-error-handler';

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, string> = {
      'Register.password': 'Password',
      'Register.placeholder': 'Enter your password',
      'Register.name': 'Name',
      'Register.name-placeholder': 'Enter your name',
      'Register.avatar': 'Avatar',
      'Register.avatar-placeholder': 'Upload an avatar',
      'Register.btn': 'Register',
      'Register.success': 'Registration successful!',
      'Register.logout-btn': 'Logout',
      'Register.error': 'Registration failed',
      'Register.try-again': 'Try again',
      'Register.user-exist': 'User already exists',
      'ValidationErrors.email_required': 'Email is required',
      'ValidationErrors.email_invalid': 'Invalid email format',
      'ValidationErrors.password_required': 'Password is required',
      'ValidationErrors.password_min': 'Password must be at least 6 characters',
      'ValidationErrors.username_required': 'Name is required',
      'ValidationErrors.avatar_required': 'Avatar is required',
      'ValidationErrors.avatar_invalid': 'Invalid avatar format',
    };

    const fullKey = namespace ? `${namespace}.${key}` : key;
    return translations[fullKey] || translations[key] || key;
  },
}));

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/ui/sonner', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-logout', () => ({
  useLogout: jest.fn(),
}));

jest.mock('@/hooks/use-auth-form', () => ({
  useAuthForm: jest.fn(),
}));

jest.mock('@/lib/error-handlers/registration-error-handler', () => ({
  handleRegistrationError: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: ({
    render,
  }: {
    render: (props: { field: { onChange: jest.Mock } }) => ReactNode;
  }) => render({ field: { onChange: jest.fn() } }),
}));

jest.mock('@/components/ui/avatar-input', () => ({
  AvatarInput: ({
    onAvatarChange,
    placeholder,
  }: {
    onAvatarChange: (file: File) => void;
    placeholder: string;
  }) => (
    <div>
      <input
        type="file"
        data-testid="avatar-input"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onAvatarChange(e.target.files[0]);
          }
        }}
      />
      <p>{placeholder}</p>
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => <label {...props}>{children}</label>,
}));

jest.mock('@/components/layout/form/form-field', () => ({
  FormField: ({
    name,
    label,
    type,
    placeholder,
    errors,
    trigger,
  }: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    errors?: { message?: string };
    trigger?: (name: string) => void;
  }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        data-testid={name}
        onChange={() => trigger && trigger(name)}
      />
      {errors && <span data-testid={`error-${name}`}>{errors.message}</span>}
    </div>
  ),
}));

describe('RegisterForm', () => {
  const mockRegister = jest.fn();
  const mockToastSuccess = jest.fn();
  const mockToastError = jest.fn();
  const mockPush = jest.fn();
  const mockHandleLogoutSync = jest.fn();
  const mockUseAuthForm = useAuthForm as jest.Mock;
  const mockHandleRegistrationError = handleRegistrationError as jest.Mock;

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
    });

    (useToast as jest.Mock).mockReturnValue({
      toastSuccess: mockToastSuccess,
      toastError: mockToastError,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useLogout as jest.Mock).mockReturnValue({
      handleLogoutSync: mockHandleLogoutSync,
    });

    mockUseAuthForm.mockReturnValue({
      form: {
        control: {},
        handleSubmit:
          (cb: (data: unknown) => void) =>
          (e: { preventDefault: () => void }) => {
            e.preventDefault();
            cb({
              email: 'test@example.com',
              password: 'password123',
              username: 'Test User',
              avatar: new File([''], 'avatar.png', { type: 'image/png' }),
            });
          },
        formState: {
          errors: {},
          isSubmitting: false,
          isValid: true,
        },
        trigger: jest.fn(),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('render all form fields correctly', () => {
    render(<RegisterForm />);

    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-input')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Register' })
    ).toBeInTheDocument();
  });

  it('submit form with correct data', async () => {
    render(<RegisterForm />);

    const registerButton = screen.getByRole('button', { name: 'Register' });
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      const callArgs = mockRegister.mock.calls[0];
      expect(callArgs[0]).toBe('test@example.com');
      expect(callArgs[1]).toBe('password123');
      expect(callArgs[2]).toBe('Test User');
      expect(callArgs[3]).toBeInstanceOf(File);
      expect(callArgs[3].name).toBe('avatar.png');
      expect(callArgs[3].type).toBe('image/png');
    });
  });

  it('show success message on successful registration', async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    render(<RegisterForm />);

    const registerButton = screen.getByRole('button', { name: 'Register' });
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Registration successful!',
        expect.objectContaining({
          action: expect.objectContaining({
            label: 'Logout',
          }),
        })
      );
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handle registration error with email already in use', async () => {
    const error = { code: 'auth/email-already-in-use' };
    mockRegister.mockRejectedValueOnce(error);

    mockHandleRegistrationError.mockReturnValueOnce({
      isEmailInUse: true,
      code: 'auth/email-already-in-use',
      message: '',
    });

    render(<RegisterForm />);

    const registerButton = screen.getByRole('button', { name: 'Register' });
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('User already exists');
    });
  });

  it('disable button when form is submitting', () => {
    mockUseAuthForm.mockReturnValueOnce({
      form: {
        control: {},
        handleSubmit: jest.fn(),
        formState: {
          errors: {},
          isSubmitting: true,
          isValid: true,
        },
        trigger: jest.fn(),
      },
    });

    render(<RegisterForm />);

    const registerButton = screen.getByRole('button', { name: 'Register' });
    expect(registerButton).toBeDisabled();
  });

  it('disable button when form is invalid', () => {
    mockUseAuthForm.mockReturnValueOnce({
      form: {
        control: {},
        handleSubmit: jest.fn(),
        formState: {
          errors: {},
          isSubmitting: false,
          isValid: false,
        },
        trigger: jest.fn(),
      },
    });

    render(<RegisterForm />);

    const registerButton = screen.getByRole('button', { name: 'Register' });
    expect(registerButton).toBeDisabled();
  });

  it('allow avatar upload', async () => {
    render(<RegisterForm />);

    const avatarInput = screen.getByTestId('avatar-input');
    const file = new File([''], 'avatar.png', { type: 'image/png' });

    await userEvent.upload(avatarInput, file);

    expect(avatarInput).toBeInTheDocument();
  });
});
