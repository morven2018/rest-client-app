import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('SidebarProvider', () => {
  it('provide sidebar context to children', () => {
    const TestComponent = () => {
      const sidebar = useSidebar();
      return <div data-testid="test">{sidebar.state}</div>;
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId('test')).toHaveTextContent('expanded');
  });

  it('throw error when useSidebar is used without provider', () => {
    const TestComponent = () => {
      useSidebar();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useSidebar must be used within a SidebarProvider.'
    );
  });

  it('allow toggling sidebar state', () => {
    const TestComponent = () => {
      const { toggleSidebar, state } = useSidebar();
      return (
        <>
          <button onClick={toggleSidebar}>Toggle</button>
          <div data-testid="state">{state}</div>
        </>
      );
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });
});
