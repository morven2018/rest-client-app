import CustomSidebar from '@/components/layout/sidebar/sidebar';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/layout/sidebar/nav-menu', () => ({
  __esModule: true,
  default: () => <div data-testid="nav-menu">Nav Menu</div>,
}));

jest.mock('@/components/layout/sidebar/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu">User Menu</div>,
}));

jest.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="sidebar" {...props}>
      {children}
    </div>
  ),
  SidebarContent: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="sidebar-content" {...props}>
      {children}
    </div>
  ),
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
}));

describe('CustomSidebar', () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  it('render without crashing', () => {
    render(<CustomSidebar>{mockChildren}</CustomSidebar>);
    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
  });

  it('render all child components', () => {
    render(<CustomSidebar>{mockChildren}</CustomSidebar>);

    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('apply correct layout classes', () => {
    const { container } = render(<CustomSidebar>{mockChildren}</CustomSidebar>);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('min-h-screen');
  });

  it('apply correct sidebar styling', () => {
    render(<CustomSidebar>{mockChildren}</CustomSidebar>);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('h-screen');
    expect(sidebar).toHaveClass('sticky');
    expect(sidebar).toHaveClass('top-0');
    expect(sidebar).toHaveClass('p-4');
    expect(sidebar).toHaveClass('rounded-lg');
    expect(sidebar).toHaveClass('bg-neutral-100');
    expect(sidebar).toHaveClass('dark:bg-zinc-950');
  });

  it('pass through props to Sidebar component', () => {
    const testProps = {
      collapsible: 'icon' as const,
      'data-test-prop': 'test-value',
    };
    render(<CustomSidebar {...testProps}>{mockChildren}</CustomSidebar>);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveAttribute('data-test-prop', 'test-value');
  });

  it('have proper sidebar content structure', () => {
    render(<CustomSidebar>{mockChildren}</CustomSidebar>);

    const sidebarContent = screen.getByTestId('sidebar-content');
    expect(sidebarContent).toHaveClass('flex');
    expect(sidebarContent).toHaveClass('flex-col');
    expect(sidebarContent).toHaveClass('h-full');

    expect(sidebarContent).toContainElement(screen.getByTestId('nav-menu'));
    expect(sidebarContent).toContainElement(screen.getByTestId('user-menu'));
  });

  it('handle empty children', () => {
    render(<CustomSidebar />);

    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });
});
