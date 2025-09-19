import React from 'react';
import VariablesPage from '@/app/[locale]/variables/page';
import { screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

jest.mock('next-intl/server');
jest.mock('next/headers');
jest.mock('next/navigation');

jest.mock('@/components/layout/sidebar/sidebar', () => ({
  __esModule: true,
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="sidebar" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/layout/variables/env-content', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="env-variables-table">Environment Variables Table</div>
  ),
}));

jest.mock('@/components/layout/breadcrumb-and-heading/heading', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="heading">{children}</div>
  ),
}));

const mockGetTranslations = getTranslations as jest.MockedFunction<
  typeof getTranslations
>;

describe('VariablesPage', () => {
  const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
  const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTranslations.mockReturnValue(
      Object.assign(
        (key: string) => {
          const translations: Record<string, string> = {
            title: 'Environment Variables',
          };
          return translations[key] || key;
        },
        {
          rich: jest.fn(),
          markup: jest.fn(),
          raw: jest.fn(),
          has: jest.fn(),
        }
      ) as unknown as ReturnType<typeof getTranslations>
    );
  });

  it('redirect to home page if authToken is not present', async () => {
    const mockCookieGet = jest.fn().mockReturnValue(undefined);
    mockCookies.mockReturnValue({
      get: mockCookieGet,
    } as unknown as ReturnType<typeof cookies>);

    await VariablesPage();

    expect(mockRedirect).toHaveBeenCalledWith('/');
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockCookieGet).toHaveBeenCalledWith('authToken');
  });

  it('render component if authToken is present', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: 'mock-token' });
    mockCookies.mockReturnValue({
      get: mockCookieGet,
    } as unknown as ReturnType<typeof cookies>);

    mockRedirect.mockImplementation(() => {
      throw new Error('Redirect called');
    });

    await VariablesPage();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('env-variables-table')).toBeInTheDocument();

    expect(screen.getByTestId('sidebar')).toHaveClass('min-h-120');
    expect(screen.getByText('Environment Variables')).toBeInTheDocument();

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockCookieGet).toHaveBeenCalledWith('authToken');
  });

  it('call getTranslations with correct namespace', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: 'mock-token' });
    mockCookies.mockReturnValue({
      get: mockCookieGet,
    } as unknown as ReturnType<typeof cookies>);

    await VariablesPage();

    expect(mockGetTranslations).toHaveBeenCalledWith('variables');
    expect(mockGetTranslations).toHaveBeenCalledTimes(1);
  });
});
