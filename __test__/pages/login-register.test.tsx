import LogInPage from '@/app/[locale]/login/page';
import RegisterPage from '@/app/[locale]/register/page';
import { cleanup, render, screen } from '@testing-library/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

jest.mock('@/components/layout/form/form-wrapper', () => ({
  FormWrapper: jest.fn(({ children, requireUnauth }) => (
    <div data-testid="form-wrapper" data-require-unauth={requireUnauth}>
      {children}
    </div>
  )),
}));

jest.mock('@/components/layout/form/tabs', () => ({
  FormTab: jest.fn(({ searchParams }) => (
    <div data-testid="form-tab" data-search-params={searchParams}>
      Form Tab
    </div>
  )),
}));

describe('Auth Pages', () => {
  const mockCookies = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockReturnValue(mockCookies);
  });

  describe('LogInPage', () => {
    it('redirect to home page if authToken exists', async () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'authToken') return { value: 'existing-token' };
        return undefined;
      });

      await expect(LogInPage()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/');
    });

    it('render login form if no authToken', async () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'authToken') return { value: undefined };
        return undefined;
      });

      const result = await LogInPage();
      render(result);

      expect(redirect).not.toHaveBeenCalled();
      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('form-wrapper')).toHaveAttribute(
        'data-require-unauth',
        'true'
      );
      expect(screen.getByTestId('form-tab')).toBeInTheDocument();
      expect(screen.getByTestId('form-tab')).toHaveAttribute(
        'data-search-params',
        'login'
      );
    });
  });

  describe('RegisterPage', () => {
    it('redirect to home if authToken exists', async () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'authToken') return { value: 'existing-token' };
        return undefined;
      });

      await expect(RegisterPage()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/');
    });

    it('register form if no authToken', async () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'authToken') return { value: undefined };
        return undefined;
      });

      const result = await RegisterPage();
      render(result);

      expect(redirect).not.toHaveBeenCalled();
      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('form-wrapper')).toHaveAttribute(
        'data-require-unauth',
        'true'
      );
      expect(screen.getByTestId('form-tab')).toBeInTheDocument();
      expect(screen.getByTestId('form-tab')).toHaveAttribute(
        'data-search-params',
        'register'
      );
    });

    it('register form if authToken cookie is not present', async () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'authToken') return undefined;
        return undefined;
      });

      const result = await RegisterPage();
      render(result);

      expect(redirect).not.toHaveBeenCalled();
      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('form-tab')).toHaveAttribute(
        'data-search-params',
        'register'
      );
    });
  });
  describe('Common page behavior', () => {
    it('render FormWrapper if requireUnauth=true for both pages', async () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'authToken') return { value: undefined };
        return undefined;
      });

      const loginResult = await LogInPage();
      const registerResult = await RegisterPage();

      render(loginResult);
      expect(screen.getByTestId('form-wrapper')).toHaveAttribute(
        'data-require-unauth',
        'true'
      );

      cleanup();

      render(registerResult);
      expect(screen.getByTestId('form-wrapper')).toHaveAttribute(
        'data-require-unauth',
        'true'
      );
    });
  });
});
