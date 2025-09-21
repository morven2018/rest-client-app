import RestfulPage from '@/app/[locale]/restful/[[...rest]]/page';
import { render, screen } from '@testing-library/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/app/[locale]/restful/[[...rest]]/content', () => {
  return function MockRestfulContent() {
    return <div data-testid="restful-content">Restful Content</div>;
  };
});

describe('RestfulPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirect to home if no authToken', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    await RestfulPage();
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('render RestfulContent if authToken exists', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'test-token' }),
    });

    const JSX = await RestfulPage();
    render(JSX);

    expect(screen.getByTestId('restful-content')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});
