import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { UserMenu } from '@/components/layout/sidebar/user-menu';
import { AuthContextType, useAuth } from '@/context/auth/auth-context';
import { useAvatar } from '@/hooks/use-avatar';
import { useLogout } from '@/hooks/use-logout';

jest.mock('@/context/auth/auth-context');
jest.mock('@/hooks/use-avatar');
jest.mock('@/hooks/use-logout');
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  LogOut: () => <div data-testid="logout-icon">LogOut</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  User: () => <div data-testid="user-icon">User</div>,
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid="avatar-image" data-src={src} data-alt={alt}>
      Avatar Image
    </div>
  ),
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid="dropdown-menu-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-menu-separator" />,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-trigger">{children}</div>
  ),
}));

jest.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuButton: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="sidebar-menu-button" className={className}>
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
}));

jest.mock('@radix-ui/react-dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog">{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-description">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-title">{children}</div>
  ),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    title,
  }: {
    href: string;
    children: React.ReactNode;
    title?: string;
  }) => (
    <a href={href} data-testid="link" title={title}>
      {children}
    </a>
  ),
}));

jest.mock('@/components/layout/form/update-account-form', () => ({
  UpdateAccountForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="update-account-form" onClick={() => onSuccess()}>
      Update Account Form
    </div>
  ),
}));

describe('UserMenu', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockUseAvatar = useAvatar as jest.MockedFunction<typeof useAvatar>;
  const mockUseLogout = useLogout as jest.MockedFunction<typeof useLogout>;
  const mockUseTranslations = useTranslations as jest.MockedFunction<
    typeof useTranslations
  >;

  const createMockTranslations = () => {
    const mockT = jest.fn((key: string) => {
      const translations: Record<string, string> = {
        'user-menu.profile': 'Profile',
        'user-menu.logout': 'Logout',
        'user-menu.update': 'Update Account',
      };
      return translations[key] || key;
    }) as unknown as jest.MockedFunction<(key: string) => string> & {
      rich: jest.Mock;
      markup: jest.Mock;
      raw: jest.Mock;
      has: jest.Mock;
    };

    mockT.rich = jest.fn();
    mockT.markup = jest.fn();
    mockT.raw = jest.fn();
    mockT.has = jest.fn();

    return mockT;
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      currentUser: {
        displayName: 'John Doe',
        email: 'john@example.com',
      },
      isLoading: false,
      authToken: null,
      login: jest.fn(),
      register: jest.fn(),
      getAvatar: jest.fn(),
      updateProfile: jest.fn(),
      deleteAccount: jest.fn(),
      resetPassword: jest.fn(),
      refreshToken: jest.fn(),
      setAuthToken: jest.fn(),
      clearAuthToken: jest.fn(),
    } as unknown as AuthContextType);

    mockUseAvatar.mockReturnValue({
      avatarUrl: 'https://example.com/avatar.jpg',
    } as unknown as ReturnType<typeof useAvatar>);

    mockUseLogout.mockReturnValue({
      handleLogout: jest.fn(),
    } as unknown as ReturnType<typeof useLogout>);

    const mockT = createMockTranslations();
    mockUseTranslations.mockReturnValue(
      mockT as unknown as ReturnType<typeof useTranslations>
    );

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('no render if no current user', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      isLoading: false,
      authToken: null,
      login: jest.fn(),
      register: jest.fn(),
      getAvatar: jest.fn(),
      updateProfile: jest.fn(),
      deleteAccount: jest.fn(),
      resetPassword: jest.fn(),
      refreshToken: jest.fn(),
      setAuthToken: jest.fn(),
      clearAuthToken: jest.fn(),
    } as unknown as AuthContextType);

    const { container } = render(<UserMenu />);
    expect(container.firstChild).toBeNull();
  });

  it('render mobile version when window width is less than 900px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    render(<UserMenu />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/profile');
    expect(screen.getByTestId('link')).toHaveAttribute('title', 'profile');
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('render desktop version when window width is 900px or more', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    render(<UserMenu />);

    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('john@example.com')[0]).toBeInTheDocument();
  });

  it('display avatar image when avatarUrl is available', () => {
    render(<UserMenu />);

    const avatarImage = screen.getAllByTestId('avatar-image')[0];
    expect(avatarImage).toHaveAttribute(
      'data-src',
      'https://example.com/avatar.jpg'
    );
    expect(avatarImage).toHaveAttribute('data-alt', 'John Doe');
  });

  it('display avatar fallback when avatarUrl is not available', () => {
    mockUseAvatar.mockReturnValue({
      avatarUrl: null,
    } as unknown as ReturnType<typeof useAvatar>);

    render(<UserMenu />);

    expect(screen.getAllByTestId('avatar-fallback')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('user-icon')[0]).toBeInTheDocument();
  });

  it('call handleLogout when logout button is clicked in mobile view', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const handleLogout = jest.fn();
    mockUseLogout.mockReturnValue({
      handleLogout,
    } as unknown as ReturnType<typeof useLogout>);

    render(<UserMenu />);

    const logoutButton = screen.getByTitle('logout');
    fireEvent.click(logoutButton);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('handle user without display name', () => {
    mockUseAuth.mockReturnValue({
      currentUser: {
        displayName: null,
        email: 'test@example.com',
      },
      isLoading: false,
      authToken: null,
      login: jest.fn(),
      register: jest.fn(),
      getAvatar: jest.fn(),
      updateProfile: jest.fn(),
      deleteAccount: jest.fn(),
      resetPassword: jest.fn(),
      refreshToken: jest.fn(),
      setAuthToken: jest.fn(),
      clearAuthToken: jest.fn(),
    } as unknown as AuthContextType);

    render(<UserMenu />);

    expect(screen.getAllByText('test@example.com')[0]).toBeInTheDocument();
  });

  it('update layout on window resize', async () => {
    render(<UserMenu />);

    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      expect(screen.getByTestId('link')).toHaveAttribute('href', '/profile');
    });
  });
});
