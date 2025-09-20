import GreetingsSection from '@/components/layout/greetings/Greetings';
import { render, screen } from '@testing-library/react';
import { useAuth } from '@/context/auth/auth-context';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      Greetings: {
        title: 'Welcome',
        descriptions: 'Start your journey with us',
        btnRest: 'REST API',
        btnHistory: 'History',
        btnVariables: 'Variables',
        btnLogin: 'Sign In',
        btnRegister: 'Sign Up',
      },
    };
    return (key: string) => translations[namespace]?.[key] || key;
  }),
}));

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: jest.fn(({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, asChild, variant, className, ...props }) => {
    if (asChild) {
      return <div className={className}>{children}</div>;
    }
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  }),
}));

describe('GreetingsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render greetings for authenticated user with display name', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'John Doe',
      },
    });

    render(<GreetingsSection />);

    expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    expect(screen.getByText('Start your journey with us')).toBeInTheDocument();
    expect(screen.getByText('REST API')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });

  it('render greetings for authenticated user without display name', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: null,
      },
    });

    render(<GreetingsSection />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Start your journey with us')).toBeInTheDocument();
  });

  it('render login/register buttons for unauthenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
    });

    render(<GreetingsSection />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Start your journey with us')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('render correct links for authenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'John Doe',
      },
    });

    render(<GreetingsSection />);

    const restLink = screen.getByText('REST API').closest('a');
    const historyLink = screen.getByText('History').closest('a');
    const variablesLink = screen.getByText('Variables').closest('a');

    expect(restLink).toHaveAttribute('href', '/restful');
    expect(historyLink).toHaveAttribute('href', '/history-and-analytics');
    expect(variablesLink).toHaveAttribute('href', '/variables');
  });

  it('render correct links for unauthenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
    });

    render(<GreetingsSection />);

    const loginLink = screen.getByText('Sign In').closest('a');
    const registerLink = screen.getByText('Sign Up').closest('a');

    expect(loginLink).toHaveAttribute('href', '/login');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('apply correct CSS classes to button containers', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'John Doe',
      },
    });

    render(<GreetingsSection />);

    const buttonContainers = screen
      .getAllByText('REST API')
      .map((element) => element.parentElement)
      .filter(Boolean);

    buttonContainers.forEach((container) => {
      expect(container).toHaveClass('bg-zinc-200');
      expect(container).toHaveClass('hover:bg-zinc-100');
      expect(container).toHaveClass('dark:bg-neutral-600');
      expect(container).toHaveClass('dark:hover:bg-neutral-700');
      expect(container).toHaveClass('w-28');
    });
  });

  it('render with correct container classes', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'John Doe',
      },
    });

    const { container } = render(<GreetingsSection />);

    const section = container.firstChild;
    expect(section).toHaveClass('w-full');
    expect(section).toHaveClass('bg-gray-50');
    expect(section).toHaveClass('dark:bg-gray-900');
    expect(section).toHaveClass('py-12');
    expect(section).toHaveClass('px-4');
  });

  it('render inner content with correct styling', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'John Doe',
      },
    });

    render(<GreetingsSection />);

    const innerDiv = screen.getByText('Welcome, John Doe!').closest('div');
    expect(innerDiv).toHaveClass('bg-[#FFFFFFB2]');
    expect(innerDiv).toHaveClass('dark:bg-[#0A0A0AB2]');
    expect(innerDiv).toHaveClass('px-8');
    expect(innerDiv).toHaveClass('py-16');
    expect(innerDiv).toHaveClass('rounded-[8px]');
  });

  it('handle empty currentUser object gracefully', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: undefined,
    });

    render(<GreetingsSection />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('apply correct flex layout for buttons', () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        displayName: 'John Doe',
      },
    });

    render(<GreetingsSection />);

    const buttonContainer = screen.getByText('REST API').closest('div');
    expect(buttonContainer).toHaveClass(
      'bg-zinc-200 hover:bg-zinc-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 w-28'
    );
  });
});
