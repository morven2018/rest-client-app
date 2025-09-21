import CustomBreadcrumb from '@/components/layout/breadcrumb-and-heading/breadcrumb';
import { render, screen } from '@testing-library/react';
import { formatBreadcrumbName } from '@/lib/formatter';

jest.mock('@/lib/formatter', () => ({
  formatBreadcrumbName: jest.fn((name: string) => name.toUpperCase()),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: jest.fn(
    ({
      children,
      href,
      className,
    }: {
      children: React.ReactNode;
      href: string;
      className?: string;
    }) => (
      <a href={href} className={className} data-testid="link">
        {children}
      </a>
    )
  ),
}));

jest.mock('lucide-react', () => ({
  Home: jest.fn(() => <div data-testid="home-icon">Home Icon</div>),
}));

jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: jest.fn(
    ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <nav className={className} data-testid="breadcrumb">
        {children}
      </nav>
    )
  ),
  BreadcrumbList: jest.fn(({ children }: { children: React.ReactNode }) => (
    <ol data-testid="breadcrumb-list">{children}</ol>
  )),
  BreadcrumbItem: jest.fn(({ children }: { children: React.ReactNode }) => (
    <li data-testid="breadcrumb-item">{children}</li>
  )),
  BreadcrumbLink: jest.fn(
    ({
      children,
      asChild,
      className,
    }: {
      children: React.ReactNode;
      asChild?: boolean;
      className?: string;
    }) => (
      <span
        className={className}
        data-testid="breadcrumb-link"
        data-as-child={asChild}
      >
        {children}
      </span>
    )
  ),
  BreadcrumbPage: jest.fn(
    ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <span className={className} data-testid="breadcrumb-page">
        {children}
      </span>
    )
  ),
  BreadcrumbSeparator: jest.fn(() => (
    <span data-testid="breadcrumb-separator">/</span>
  )),
}));

describe('CustomBreadcrumb', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render home icon for root path', () => {
    render(<CustomBreadcrumb pathname="/" />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
    expect(
      screen.queryByTestId('breadcrumb-separator')
    ).not.toBeInTheDocument();
  });

  it('render single level path with page', () => {
    render(<CustomBreadcrumb pathname="/profile" />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-separator')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-page')).toHaveTextContent('PROFILE');
    expect(screen.getByTestId('breadcrumb-page')).toHaveClass(
      'text-violet-900 dark:text-violet-500'
    );
  });

  it('render two level path with link and page', () => {
    render(<CustomBreadcrumb pathname="/variables/production" />);

    expect(screen.getAllByTestId('breadcrumb-separator')).toHaveLength(2);
    expect(screen.getAllByTestId('breadcrumb-link')[1]).toHaveTextContent(
      'VARIABLES'
    );
    expect(screen.getByTestId('breadcrumb-page')).toHaveTextContent(
      'PRODUCTION'
    );

    const links = screen.getAllByTestId('link');
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/variables');
  });

  it('call formatBreadcrumbName for each segment', () => {
    render(<CustomBreadcrumb pathname="/variables/production" />);

    expect(formatBreadcrumbName).toHaveBeenCalledWith('variables');
    expect(formatBreadcrumbName).toHaveBeenCalledWith('production');
  });

  it('apply correct CSS classes', () => {
    render(<CustomBreadcrumb pathname="/profile" />);

    expect(screen.getByTestId('breadcrumb')).toHaveClass('py-2');
    expect(screen.getByTestId('breadcrumb-link')).toHaveClass(
      'text-neutral-800 dark:text-neutral-100'
    );
    expect(screen.getByTestId('breadcrumb-page')).toHaveClass(
      'text-violet-900 dark:text-violet-500'
    );
  });

  it('handle complex paths with multiple segments', () => {
    render(<CustomBreadcrumb pathname="/deep/nested/path" />);

    expect(screen.getAllByTestId('breadcrumb-separator')).toHaveLength(1);
    expect(screen.getAllByTestId('breadcrumb-link')[1]).toHaveTextContent(
      'DEEP'
    );
    expect(screen.queryByTestId('breadcrumb-page')).not.toBeInTheDocument();
  });

  it('handle paths with trailing slash', () => {
    render(<CustomBreadcrumb pathname="/variables/" />);

    expect(screen.getByTestId('breadcrumb-page')).toHaveTextContent(
      'VARIABLES'
    );
  });

  it('handle empty path segments', () => {
    render(<CustomBreadcrumb pathname="//variables//production//" />);

    expect(screen.getAllByTestId('breadcrumb-separator')).toHaveLength(2);
    expect(screen.getAllByTestId('breadcrumb-link')[0]).toHaveTextContent(
      'Home Icon'
    );
    expect(screen.getByTestId('breadcrumb-page')).toHaveTextContent(
      'PRODUCTION'
    );
  });

  it('apply dark mode classes correctly', () => {
    render(<CustomBreadcrumb pathname="/profile" />);

    const breadcrumbLink = screen.getByTestId('breadcrumb-link');
    const breadcrumbPage = screen.getByTestId('breadcrumb-page');

    expect(breadcrumbLink).toHaveClass('dark:text-neutral-100');
    expect(breadcrumbPage).toHaveClass('dark:text-violet-500');
  });
});
