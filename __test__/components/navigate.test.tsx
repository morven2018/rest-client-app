import React, { ReactElement, ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Navigate } from '@/components/navigate/Navigate';
import { useAuth } from '@/context/auth/auth-context';
import { useLogout } from '@/hooks/use-logout';
import { useTheme } from '@/hooks/useTheme';
import { usePathname, useRouter } from '@/i18n/navigation';

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
  useTranslations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-logout', () => ({
  useLogout: jest.fn(),
}));

jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    asChild,
    variant,
    className,
    onClick,
    ...props
  }: {
    children: ReactNode;
    asChild?: boolean;
    variant?: string;
    className?: string;
    onClick?: () => void;
    [key: string]: unknown;
  }) => {
    if (asChild) {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className,
            ...props,
          } as Partial<unknown>);
        }
        return child;
      });
    }
    return (
      <button
        onClick={onClick}
        className={className}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    );
  },
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: ReactNode;
    value: string;
    onValueChange?: (value: string) => void;
  }) => (
    <div data-value={value} data-testid="select">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onValueChange,
          } as Partial<unknown>);
        }
        return child;
      })}
    </div>
  ),
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <div data-testid="select-value" data-placeholder={placeholder}>
      {placeholder}
    </div>
  ),
  SelectContent: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="select-content">
      {children}
    </div>
  ),
  SelectItem: ({
    children,
    value,
    className,
  }: {
    children: ReactNode;
    value: string;
    className?: string;
  }) => {
    const handleClick = () => {
      if (React.isValidElement(children)) {
        const childProps = (children as ReactElement).props;
        const onClickHandler = (childProps as { onClick?: () => void }).onClick;
        if (typeof onClickHandler === 'function') {
          onClickHandler();
        }
      }
    };

    return (
      <div
        data-value={value}
        className={className}
        data-testid={`select-item-${value}`}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  },
}));

jest.mock('lucide-react', () => ({
  LogIn: () => <div data-testid="log-in-icon">LogIn</div>,
  LogOut: () => <div data-testid="log-out-icon">LogOut</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  X: () => <div data-testid="x-icon">X</div>,
}));

jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('Navigate', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseLogout = useLogout as jest.Mock;
  const mockUseTheme = useTheme as jest.Mock;
  const mockUseLocale = useLocale as jest.Mock;
  const mockUseTranslations = useTranslations as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;
  const mockUsePathname = usePathname as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  const mockHandleLogoutSync = jest.fn();
  const mockToggleTheme = jest.fn();
  const mockRouterReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      authToken: null,
      currentUser: null,
    });

    mockUseLogout.mockReturnValue({
      handleLogoutSync: mockHandleLogoutSync,
    });

    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    mockUseLocale.mockReturnValue('en');

    mockUseTranslations.mockReturnValue((key: string) => {
      const translations: Record<string, string> = {
        'Header.login': 'login',
        'Header.register': 'register',
        'Header.logout': 'logout',
      };
      return translations[key] || key;
    });

    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    mockUsePathname.mockReturnValue('/');

    mockUseRouter.mockReturnValue({
      replace: mockRouterReplace,
    });
  });

  it('call logout when logout button is clicked', () => {
    mockUseAuth.mockReturnValue({
      authToken: 'test-token',
      currentUser: { name: 'Test User' },
    });

    render(<Navigate />);

    const logoutButton = screen.getByText('logout');
    fireEvent.click(logoutButton);

    expect(mockHandleLogoutSync).toHaveBeenCalled();
  });

  it('toggle theme when theme button is clicked', () => {
    render(<Navigate />);

    const themeButton = screen.getByTestId('sun-icon').closest('button');
    if (themeButton) {
      fireEvent.click(themeButton);
    }

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('toggle mobile menu', () => {
    render(<Navigate />);
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();

    const menuButton = screen.getByTestId('menu-icon').closest('button');
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    expect(screen.getByTestId('x-icon')).toBeInTheDocument();

    const closeButton = screen.getByTestId('x-icon').closest('button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
  });

  it('apply correct CSS classes for dark theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<Navigate />);

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('handle body overflow when menu is open/closed', () => {
    render(<Navigate />);

    const menuButton = screen.getByTestId('menu-icon').closest('button');
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    expect(document.body.style.overflow).toBe('hidden');

    const closeButton = screen.getByTestId('x-icon').closest('button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(document.body.style.overflow).toBe('unset');
  });
});
