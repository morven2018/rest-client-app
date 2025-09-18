import '@testing-library/jest-dom';
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  SidebarProvider,
  useSidebar,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
} from '@/components/ui/sidebar';

const mockDocumentCookie = {
  get: jest.fn(),
  set: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(document, 'cookie', {
  get: jest.fn().mockImplementation(() => mockDocumentCookie.get()),
  set: jest.fn().mockImplementation((value) => mockDocumentCookie.set(value)),
});

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  jest.restoreAllMocks();
});

beforeEach(() => {
  mockDocumentCookie.get.mockReturnValue('');
  mockDocumentCookie.set.mockClear();
  mockDocumentCookie.clear.mockClear();
  jest.clearAllMocks();
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

  it('use defaultOpen prop correctly', () => {
    const TestComponent = () => {
      const { state } = useSidebar();
      return <div data-testid="state">{state}</div>;
    };

    render(
      <SidebarProvider defaultOpen={false}>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('respect controlled open prop', () => {
    const TestComponent = () => {
      const { state } = useSidebar();
      return <div data-testid="state">{state}</div>;
    };

    const { rerender } = render(
      <SidebarProvider open={true}>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');

    rerender(
      <SidebarProvider open={false}>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('call onOpenChange callback when provided', () => {
    const mockOnOpenChange = jest.fn();
    const TestComponent = () => {
      const { toggleSidebar } = useSidebar();
      return <button onClick={toggleSidebar}>Toggle</button>;
    };

    render(
      <SidebarProvider onOpenChange={mockOnOpenChange}>
        <TestComponent />
      </SidebarProvider>
    );

    fireEvent.click(screen.getByText('Toggle'));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('set cookie when sidebar state changes', () => {
    const TestComponent = () => {
      const { toggleSidebar } = useSidebar();
      return <button onClick={toggleSidebar}>Toggle</button>;
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    fireEvent.click(screen.getByText('Toggle'));
    expect(mockDocumentCookie.set).toHaveBeenCalledWith(
      `${SIDEBAR_COOKIE_NAME}=false; path=/; max-age=604800`
    );
  });

  it('handle keyboard shortcuts', () => {
    const TestComponent = () => {
      const { state } = useSidebar();
      return <div data-testid="state">{state}</div>;
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );
    const metaKeyEvent = new KeyboardEvent('keydown', {
      key: SIDEBAR_KEYBOARD_SHORTCUT,
      metaKey: true,
      ctrlKey: false,
    });

    act(() => {
      window.dispatchEvent(metaKeyEvent);
    });

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');

    const ctrlKeyEvent = new KeyboardEvent('keydown', {
      key: SIDEBAR_KEYBOARD_SHORTCUT,
      metaKey: false,
      ctrlKey: true,
    });

    act(() => {
      window.dispatchEvent(ctrlKeyEvent);
    });

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
  });

  it('close sidebar on Escape key when open', () => {
    const TestComponent = () => {
      const { state } = useSidebar();
      return <div data-testid="state">{state}</div>;
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
    });

    act(() => {
      window.dispatchEvent(escapeEvent);
    });

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('do not close sidebar on Escape key when already closed', () => {
    const TestComponent = () => {
      const { state } = useSidebar();
      return <div data-testid="state">{state}</div>;
    };

    render(
      <SidebarProvider defaultOpen={false}>
        <TestComponent />
      </SidebarProvider>
    );

    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
    });

    act(() => {
      window.dispatchEvent(escapeEvent);
    });

    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('provide correct context values', () => {
    const TestComponent = () => {
      const sidebar = useSidebar();
      return (
        <div>
          <div data-testid="state">{sidebar.state}</div>
          <div data-testid="open">{sidebar.open.toString()}</div>
          <div data-testid="isMobile">{sidebar.isMobile.toString()}</div>
          <div data-testid="openMobile">{sidebar.openMobile.toString()}</div>
        </div>
      );
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
    expect(screen.getByTestId('open')).toHaveTextContent('true');
    expect(screen.getByTestId('isMobile')).toHaveTextContent('false');
    expect(screen.getByTestId('openMobile')).toHaveTextContent('false');
  });

  it('clean up event listeners on unmount', () => {
    let eventHandler: ((event: KeyboardEvent) => void) | null = null;

    const addEventListenerSpy = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(
        (type: string, handler: EventListenerOrEventListenerObject) => {
          if (type === 'keydown' && typeof handler === 'function') {
            eventHandler = handler as (event: KeyboardEvent) => void;
          }
        }
      );

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <SidebarProvider>
        <div>Test</div>
      </SidebarProvider>
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      eventHandler
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('handle functional setOpen calls', () => {
    const TestComponent = () => {
      const { setOpen, state } = useSidebar();
      return (
        <>
          <button onClick={() => setOpen(!state)}>Toggle Functional</button>
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
    fireEvent.click(screen.getByText('Toggle Functional'));
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });
});
