import '@testing-library/jest-dom';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classNames) => classNames.filter(Boolean).join(' ')),
}));

jest.mock('@radix-ui/react-separator', () => ({
  Root: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

describe('Separator', () => {
  beforeEach(() => {
    jest.mocked(cn).mockClear();
    jest.mocked(SeparatorPrimitive.Root).mockClear();
  });

  it('render with default props', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-slot', 'separator');
  });

  it('call cn function with correct arguments', () => {
    render(<Separator className="custom-class" />);

    expect(cn).toHaveBeenCalledWith(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      'custom-class'
    );
  });

  it('pass correct props to Radix Separator', () => {
    render(
      <Separator
        orientation="vertical"
        decorative={false}
        className="test-class"
        id="test-id"
      />
    );

    expect(SeparatorPrimitive.Root).toHaveBeenCalled();

    const call = jest.mocked(SeparatorPrimitive.Root).mock.calls[0];
    const props = call[0];

    expect(props.decorative).toBe(false);
    expect(props.orientation).toBe('vertical');
    expect(props.id).toBe('test-id');
    expect(props).toHaveProperty('data-slot', 'separator');
  });

  it('have correct default values for orientation and decorative', () => {
    render(<Separator />);

    expect(SeparatorPrimitive.Root).toHaveBeenCalled();

    const call = jest.mocked(SeparatorPrimitive.Root).mock.calls[0];
    const props = call[0];

    expect(props.orientation).toBe('horizontal');
    expect(props.decorative).toBe(true);
  });

  it('applies correct CSS classes for horizontal orientation', () => {
    render(<Separator orientation="horizontal" />);

    expect(cn).toHaveBeenCalledWith(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      undefined
    );
  });

  it('apply correct CSS classes for vertical orientation', () => {
    render(<Separator orientation="vertical" />);

    expect(cn).toHaveBeenCalledWith(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      undefined
    );
  });

  it('merge custom className with base classes', () => {
    render(<Separator className="my-custom-class" />);

    expect(cn).toHaveBeenCalledWith(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      'my-custom-class'
    );
  });

  it('pass through all additional props', () => {
    render(
      <Separator
        id="test-separator"
        aria-label="Separator"
        style={{ color: 'red' }}
        data-test="test-data"
      />
    );

    expect(SeparatorPrimitive.Root).toHaveBeenCalled();

    const call = jest.mocked(SeparatorPrimitive.Root).mock.calls[0];
    const props = call[0];

    expect(props.id).toBe('test-separator');
    expect(props['aria-label']).toBe('Separator');
    expect(props.style).toEqual({ color: 'red' });
  });
});
