import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import { render, screen } from '@testing-library/react';
import { usePathname } from '@/i18n/navigation';

jest.mock('@/components/layout/breadcrumb-and-heading/breadcrumb', () =>
  jest.fn(() => <div data-testid="custom-breadcrumb" />)
);
jest.mock('@/i18n/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Heading', () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/test-path');
  });

  it('render children and breadcrumb', () => {
    render(
      <Heading>
        <div data-testid="test-child">Test Content</div>
      </Heading>
    );

    expect(screen.getByTestId('custom-breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    const { container } = render(
      <Heading>
        <div>Test</div>
      </Heading>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('p-5');
    expect(wrapper).toHaveClass('mt-6');
    expect(wrapper).toHaveClass('max-[450px]:px-0');
  });

  it('render multiple children', () => {
    render(
      <Heading>
        <h1 data-testid="title">Title</h1>
        <p data-testid="description">Description</p>
        <button data-testid="button">Click me</button>
      </Heading>
    );

    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('description')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('render with empty children', () => {
    render(<Heading>{null}</Heading>);

    expect(screen.getByTestId('custom-breadcrumb')).toBeInTheDocument();
  });

  it('apply responsive CSS classes', () => {
    const { container } = render(
      <Heading>
        <div>Test</div>
      </Heading>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('max-[450px]:px-0');
  });
});
