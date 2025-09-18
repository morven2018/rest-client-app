import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

jest.mock('lucide-react', () => ({
  PanelLeftIcon: () => <svg data-testid="panel-icon" />,
}));

describe('SidebarTrigger', () => {
  it('render trigger button', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-sidebar', 'trigger');
  });

  it('toggle sidebar on click', () => {
    const TestComponent = () => {
      const sidebar = useSidebar();
      return (
        <>
          <SidebarTrigger />
          <div data-testid="state">{sidebar.state}</div>
        </>
      );
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });
});
