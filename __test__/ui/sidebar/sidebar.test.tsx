import { render, screen } from '@testing-library/react';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';

describe('Sidebar', () => {
  const MockChild = () => <div>Sidebar Content</div>;

  it('render with default props', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <MockChild />
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });

  it('render non-collapsible sidebar', () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <MockChild />
        </Sidebar>
      </SidebarProvider>
    );

    const sidebar = screen
      .getByText('Sidebar Content')
      .closest('[data-slot="sidebar"]');
    expect(sidebar).toBeInTheDocument();
  });

  it('apply different variants', () => {
    const { rerender } = render(
      <SidebarProvider>
        <Sidebar variant="floating">
          <MockChild />
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();

    rerender(
      <SidebarProvider>
        <Sidebar variant="inset">
          <MockChild />
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });
});
