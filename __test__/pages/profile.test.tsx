import ProfilePage from '@/app/[locale]/profile/page';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { toastSuccess } from '@/components/ui/sonner';
import { useAuthToken } from '@/hooks/use-auth-token';
import { useRouter } from '@/i18n/navigation';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-auth-token', () => ({
  useAuthToken: jest.fn(),
}));

jest.mock('@/components/ui/sonner', () => ({
  toastSuccess: jest.fn(),
}));

jest.mock('@/components/layout/auth-redirection/auth-wrapper', () => ({
  AuthWrapper: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('@/components/layout/form/update-account-form', () => ({
  UpdateAccountForm: jest.fn(({ onSuccess }) => (
    <div data-testid="update-account-form" onClick={() => onSuccess()}>
      Update Account Form
    </div>
  )),
}));

jest.mock('@/components/ui/card', () => ({
  Card: jest.fn(({ children }) => <div data-testid="card">{children}</div>),
  CardContent: jest.fn(({ children }) => (
    <div data-testid="card-content">{children}</div>
  )),
  CardHeader: jest.fn(({ children }) => (
    <div data-testid="card-header">{children}</div>
  )),
  CardTitle: jest.fn(({ children }) => (
    <div data-testid="card-title">{children}</div>
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, title, asChild, ...props }) => {
    if (asChild) {
      return (
        <div data-testid="button" title={title} {...props}>
          {children}
        </div>
      );
    }
    return (
      <button data-testid="button" title={title} {...props}>
        {children}
      </button>
    );
  }),
}));

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a data-testid="link" href={href}>
        {children}
      </a>
    );
  };
});

jest.mock('lucide-react', () => ({
  Home: jest.fn(() => <div data-testid="home-icon">Home Icon</div>),
}));

describe('ProfilePage', () => {
  const mockRouterPush = jest.fn();
  const mockTranslations = jest.fn();
  const mockHasValidToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    (useTranslations as jest.Mock).mockImplementation((namespace) => {
      return (key: string) => {
        if (namespace === 'profile') {
          return mockTranslations(key);
        }
        return key;
      };
    });

    (useAuthToken as jest.Mock).mockReturnValue({
      hasValidToken: mockHasValidToken,
    });
  });

  it('render profile page when has valid token', async () => {
    mockHasValidToken.mockReturnValue(true);
    mockTranslations.mockImplementation((key) => {
      const translations: Record<string, string> = {
        title: 'Profile Title',
        'home-btn': 'Home Button',
        success: 'Success Message',
      };
      return translations[key] || key;
    });

    render(<ProfilePage />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Profile Title');
    expect(screen.getByTestId('update-account-form')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('call toastSuccess when form submission is successful', async () => {
    mockHasValidToken.mockReturnValue(true);
    mockTranslations.mockImplementation((key) => {
      if (key === 'success') return 'Success Message';
      return key;
    });

    const user = userEvent.setup();
    render(<ProfilePage />);

    const form = screen.getByTestId('update-account-form');
    await user.click(form);

    expect(toastSuccess).toHaveBeenCalledWith('Success Message');
  });

  it('display correct translations', async () => {
    mockHasValidToken.mockReturnValue(true);
    mockTranslations.mockImplementation((key) => {
      const translations: Record<string, string> = {
        title: 'My Profile',
        'home-btn': 'Go Home',
        success: 'Profile updated successfully',
      };
      return translations[key] || key;
    });

    render(<ProfilePage />);

    expect(screen.getByTestId('card-title')).toHaveTextContent('My Profile');
    expect(screen.getByTestId('button')).toHaveAttribute('title', 'Go Home');
  });

  it('have home button with correct link', async () => {
    mockHasValidToken.mockReturnValue(true);
    mockTranslations.mockImplementation((key) => key);

    render(<ProfilePage />);

    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/');
    expect(link).toContainElement(screen.getByTestId('home-icon'));
  });
});
