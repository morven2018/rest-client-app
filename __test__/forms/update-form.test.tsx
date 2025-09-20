import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { updateAccountSchema } from '@/components/layout/form/schemas/update-schema';
import { UpdateAccountForm } from '@/components/layout/form/update-account-form';
import { toastError } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { useAuthForm } from '@/hooks/use-auth-form';
import { useRouter } from '@/i18n/navigation';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      update: {
        name: 'Username',
        'name-placeholder': 'Enter your username',
        avatar: 'Avatar',
        'avatar-placeholder': 'Upload avatar',
        btn: 'Update Profile',
      },
      ValidationErrors: {
        required: 'Field is required',
        invalid_username: 'Invalid username format',
      },
    };
    return (key: string) => translations[namespace]?.[key] || key;
  }),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: jest.fn(({ render }) =>
    render({
      field: {
        onChange: jest.fn(),
        value: undefined,
      },
    })
  ),
}));

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-auth-form', () => ({
  useAuthForm: jest.fn(),
}));

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/layout/form/form-field', () => ({
  FormField: jest.fn(({ name, label, placeholder, type, errors }) => (
    <div data-testid={`field-${name}`}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        data-testid={`input-${name}`}
      />
      {errors && <span data-testid={`error-${name}`}>{errors.message}</span>}
    </div>
  )),
}));

jest.mock('@/components/ui/avatar-input', () => ({
  AvatarInput: jest.fn(({ onAvatarChange, placeholder }) => (
    <div data-testid="avatar-input">
      <input
        type="file"
        data-testid="avatar-file-input"
        onChange={(e) => onAvatarChange(e.target.files?.[0])}
      />
      <span>{placeholder}</span>
    </div>
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, disabled, type, ...props }) => (
    <button
      type={type}
      disabled={disabled}
      data-testid="update-button"
      {...props}
    >
      {children}
    </button>
  )),
}));

jest.mock('@/components/ui/label', () => ({
  Label: jest.fn(({ htmlFor, children, ...props }) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  )),
}));

jest.mock('@/components/ui/sonner', () => ({
  toastError: jest.fn(),
}));

jest.mock('@/components/layout/form/schemas/update-schema', () => ({
  updateAccountSchema: jest.fn(() => ({
    validate: jest.fn(),
  })),
}));

interface FormData {
  username?: string;
  avatar?: File;
}

describe('UpdateAccountForm', () => {
  const mockUpdateProfile = jest.fn();
  const mockRouterPush = jest.fn();
  const mockTrigger = jest.fn();
  const mockOnSuccess = jest.fn();

  const mockHandleSubmit =
    (onSubmit: (data: FormData) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ username: 'testuser', avatar: undefined });
    };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'currentuser',
      },
      updateProfile: mockUpdateProfile,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
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
    });
  });

  it('render update form with all fields', () => {
    render(<UpdateAccountForm />);

    expect(screen.getByTestId('field-username')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-input')).toBeInTheDocument();
    expect(screen.getByTestId('update-button')).toBeInTheDocument();
    expect(screen.getByTestId('update-button')).toHaveTextContent(
      'Update Profile'
    );
  });

  it('pre-fill username field with current user display name', () => {
    render(<UpdateAccountForm />);

    expect(useAuthForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          username: 'currentuser',
          avatar: undefined,
        },
      })
    );
  });

  it('call updateProfile with correct data on form submission', async () => {
    mockUpdateProfile.mockResolvedValueOnce(undefined);

    render(<UpdateAccountForm />);

    const form = screen.getByTestId('update-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith('testuser', undefined);
    });
  });

  it('call onSuccess callback and redirects on successful update', async () => {
    mockUpdateProfile.mockResolvedValueOnce(undefined);

    render(<UpdateAccountForm onSuccess={mockOnSuccess} />);

    const form = screen.getByTestId('update-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
  });

  it('handle update errors with toast notification', async () => {
    const error = new Error('Update failed');
    mockUpdateProfile.mockRejectedValueOnce(error);

    render(<UpdateAccountForm />);

    const form = screen.getByTestId('update-button').closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('{}');
    });
  });

  it('disable button when form is submitting or invalid', () => {
    (useAuthForm as jest.Mock).mockReturnValueOnce({
      form: {
        control: {},
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: { username: { message: 'Username is required' } },
          isSubmitting: false,
          isValid: false,
        },
        trigger: mockTrigger,
      },
    });

    render(<UpdateAccountForm />);

    expect(screen.getByTestId('update-button')).toBeDisabled();
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
    });

    render(<UpdateAccountForm />);

    expect(screen.getByTestId('update-button')).toBeDisabled();
  });

  it('trigger validation on avatar change', () => {
    render(<UpdateAccountForm />);

    const fileInput = screen.getByTestId('avatar-file-input');
    const file = new File(['test'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockTrigger).toHaveBeenCalledWith('avatar');
  });

  it('display error messages for fields', () => {
    (useAuthForm as jest.Mock).mockReturnValueOnce({
      form: {
        control: {},
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: {
            username: { message: 'Username is required' },
            avatar: { message: 'Avatar is required' },
          },
          isSubmitting: false,
          isValid: false,
        },
        trigger: mockTrigger,
      },
    });

    render(<UpdateAccountForm />);

    expect(screen.getByTestId('error-username')).toHaveTextContent(
      'Username is required'
    );
    expect(screen.getByText('Avatar is required')).toBeInTheDocument();
  });

  it('use correct schema with validation errors translator', () => {
    render(<UpdateAccountForm />);

    expect(updateAccountSchema).toHaveBeenCalled();

    const translatorFunction = (updateAccountSchema as jest.Mock).mock
      .calls[0][0];
    expect(typeof translatorFunction).toBe('function');
  });
});
