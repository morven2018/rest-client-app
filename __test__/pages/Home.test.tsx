import Home from '@/app/[locale]/page';
import { render } from '@testing-library/react';

jest.mock('@/components/layout/sidebar/sidebar', () => ({
  __esModule: true,
  default: ({
    className,
    children,
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => <div className={className}>Sidebar Mock {children}</div>,
}));

jest.mock('@/components/layout/team/team', () => ({
  __esModule: true,
  default: () => <div>Team Mock</div>,
}));

describe('Home', () => {
  it('Should render properly without throwing errors', () => {
    expect(() => render(<Home />)).not.toThrow();
  });

  it('Should render both Sidebar and Team components', () => {
    const { getByText } = render(<Home />);

    expect(getByText('Sidebar Mock ввы')).toBeInTheDocument();
    expect(getByText('Team Mock')).toBeInTheDocument();
  });

  it('Should pass correct className to Sidebar', () => {
    const { getByText } = render(<Home />);
    const sidebar = getByText('Sidebar Mock ввы');

    expect(sidebar).toHaveClass('min-h-120');
  });
});
