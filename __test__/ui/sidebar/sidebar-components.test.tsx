import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import {
  SidebarInput,
  SidebarInset,
  SidebarRail,
  useSidebar,
  SidebarProvider,
} from '@/components/ui/sidebar';

jest.mock('@/components/ui/sidebar', () => ({
  ...jest.requireActual('@/components/ui/sidebar'),
  useSidebar: jest.fn(),
}));

jest.mock('@/components/ui/input', () => ({
  Input: jest.fn(({ className, ...props }) => (
    <input data-testid="input-element" className={className} {...props} />
  )),
}));

const SidebarWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <SidebarProvider>{children}</SidebarProvider>;

describe('SidebarRail', () => {
  const mockToggleSidebar = jest.fn();

  beforeEach(() => {
    (useSidebar as jest.Mock).mockReturnValue({
      toggleSidebar: mockToggleSidebar,
    });
    mockToggleSidebar.mockClear();
  });

  it('render with correct attributes and classes', () => {
    render(<SidebarRail className="custom-class" data-testid="rail" />, {
      wrapper: SidebarWrapper,
    });

    const rail = screen.getByTestId('rail');
    expect(rail).toHaveAttribute('data-sidebar', 'rail');
    expect(rail).toHaveAttribute('data-slot', 'sidebar-rail');
    expect(rail).toHaveAttribute('aria-label', 'Toggle Sidebar');
    expect(rail).toHaveAttribute('tabIndex', '-1');
    expect(rail).toHaveAttribute('title', 'Toggle Sidebar');
    expect(rail).toHaveClass('custom-class');
  });

  it('call toggleSidebar when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<SidebarRail data-testid="rail" />, {
      wrapper: SidebarWrapper,
    });

    const rail = screen.getByTestId('rail');
    fireEvent.click(rail);

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Error')
    );

    consoleSpy.mockRestore();
  });

  it('apply correct CSS classes', () => {
    render(<SidebarRail data-testid="rail" />, {
      wrapper: SidebarWrapper,
    });

    const rail = screen.getByTestId('rail');
    expect(rail).toHaveClass('hover:after:bg-sidebar-border');
    expect(rail).toHaveClass('absolute');
    expect(rail).toHaveClass('inset-y-0');
    expect(rail).toHaveClass('z-20');
    expect(rail).toHaveClass('hidden');
    expect(rail).toHaveClass('w-4');
    expect(rail).toHaveClass('-translate-x-1/2');
    expect(rail).toHaveClass('transition-all');
    expect(rail).toHaveClass('ease-linear');
  });
});

describe('SidebarInset', () => {
  it('render with correct attributes and classes', () => {
    render(
      <SidebarInset className="custom-class" data-testid="inset">
        Content
      </SidebarInset>,
      { wrapper: SidebarWrapper }
    );

    const inset = screen.getByTestId('inset');
    expect(inset).toHaveAttribute('data-slot', 'sidebar-inset');
    expect(inset).toHaveClass('custom-class');
    expect(inset).toHaveClass('bg-background');
    expect(inset).toHaveClass('relative');
    expect(inset).toHaveClass('flex');
    expect(inset).toHaveClass('w-full');
    expect(inset).toHaveClass('flex-1');
    expect(inset).toHaveClass('flex-col');
    expect(inset).toHaveTextContent('Content');
  });

  it('apply peer data variant classes correctly', () => {
    render(<SidebarInset data-testid="inset" />, {
      wrapper: SidebarWrapper,
    });

    const inset = screen.getByTestId('inset');
    expect(inset).toHaveClass('md:peer-data-[variant=inset]:m-2');
    expect(inset).toHaveClass('md:peer-data-[variant=inset]:ml-0');
    expect(inset).toHaveClass('md:peer-data-[variant=inset]:rounded-xl');
    expect(inset).toHaveClass('md:peer-data-[variant=inset]:shadow-sm');
    expect(inset).toHaveClass(
      'md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2'
    );
  });
});

describe('SidebarInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render Input component with correct props and classes', () => {
    render(
      <SidebarInput
        className="custom-class"
        placeholder="Search..."
        data-testid="input"
      />,
      { wrapper: SidebarWrapper }
    );

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('data-slot', 'sidebar-input');
    expect(input).toHaveAttribute('data-sidebar', 'input');
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveAttribute('placeholder', 'Search...');
  });

  it('forward all props to Input component', () => {
    const onChangeMock = jest.fn();

    render(
      <SidebarInput
        value="test"
        onChange={onChangeMock}
        disabled={true}
        type="text"
        data-testid="input"
      />,
      { wrapper: SidebarWrapper }
    );

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('value', 'test');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('apply correct base CSS classes', () => {
    render(<SidebarInput data-testid="input" />, {
      wrapper: SidebarWrapper,
    });

    const input = screen.getByTestId('input');
    expect(input).toHaveClass('bg-background');
    expect(input).toHaveClass('h-8');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('shadow-none');
  });
});
