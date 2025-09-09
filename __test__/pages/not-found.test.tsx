import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('NotFound Page', () => {
  it('should render without throwing errors', () => {
    expect(() => render(<NotFound />)).not.toThrow();
  });

  it('should display the error message', () => {
    render(<NotFound />);

    expect(screen.getByText('Oooops!')).toBeTruthy();
    expect(screen.getByText('This page is not found')).toBeTruthy();
  });

  render(<NotFound />);

  const homeLink = screen.getByText('Home');
  expect(homeLink).toBeTruthy();
});

describe('NotFound Page Snapshot', () => {
  it('should match snapshot', () => {
    const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  });
});
