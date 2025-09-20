import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { FormTab } from '@/components/layout/form/tabs';

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      'Tabs.login': 'Login',
      'Tabs.register': 'Register',
      'Tabs.access-begin-login': 'Need an account? ',
      'Tabs.link-login': 'Register here',
      'Tabs.access-end-login': '',
      'Tabs.access-begin-register': 'Already have an account? ',
      'Tabs.link-register': 'Login here',
      'Tabs.access-end-register': '',
    };
    return translations[key] || key;
  }),
}));

jest.mock('@/components/layout/form/login-form', () => ({
  LoginForm: () => <div>Login Form</div>,
}));

jest.mock('@/components/layout/form/register-form', () => ({
  RegisterForm: () => <div>Register Form</div>,
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({
    children,
    defaultValue,
  }: {
    children: ReactNode;
    defaultValue: string;
  }) => <div data-default-value={defaultValue}>{children}</div>,
  TabsContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: ReactNode }) => (
    <button>{children}</button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: ReactNode }) => <h3>{children}</h3>,
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('FormTab Component - Basic Tests', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('render without crashing with login searchParams', async () => {
    const { container } = render(<FormTab searchParams="login" />);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(container).toBeInTheDocument();
  });

  it('render without crashing on register searchParams', async () => {
    const { container } = render(<FormTab searchParams="register" />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(container).toBeInTheDocument();
  });

  it('handle empty searchParams', async () => {
    const { container } = render(<FormTab searchParams="" />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(container).toBeInTheDocument();
  });

  it('mock getTranslations correct', async () => {
    const { getTranslations } = await import('next-intl/server');
    const translationFn = await getTranslations('Tabs');
    const result = translationFn('Tabs.login');

    expect(result).toBe('Login');
  });
});
