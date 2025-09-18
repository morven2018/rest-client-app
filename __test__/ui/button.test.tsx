import '@testing-library/jest-dom';
import * as utils from '@/lib/utils';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

jest.mock('@radix-ui/react-slot', () => ({
  Slot: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

jest.mock('class-variance-authority', () => ({
  cva: jest.fn(() => jest.fn(() => 'mock-classes')),
}));

jest.mock('@/lib/utils', () => {
  const originalModule = jest.requireActual('@/lib/utils');
  return {
    ...originalModule,
    cn: jest.fn((...classNames) => classNames.filter(Boolean).join(' ')),
  };
});

describe('Button', () => {
  beforeEach(() => {
    jest.mocked(utils.cn).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('render as button by default with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('apply correct classes through cn function', () => {
    render(<Button>Click me</Button>);
    expect(utils.cn).toHaveBeenCalled();
  });

  it('render with different variants', () => {
    const variants = [
      'default',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'link',
    ] as const;

    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
      unmount();
    });
  });

  it('render with different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
      unmount();
    });
  });

  it('pass all button props correctly', () => {
    const onClick = jest.fn();

    render(
      <Button
        id="test-button"
        disabled
        onClick={onClick}
        type="submit"
        className="custom-class"
      >
        Test Button
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toHaveAttribute('id', 'test-button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('handle accessibility attributes', () => {
    render(
      <Button aria-label="Accessible button" aria-disabled="true">
        Test
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Accessible button' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('call onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    button.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('render as child when asChild is true', () => {
    const mockSlot = jest.fn(({ children, ...props }) => (
      <div {...props}>{children}</div>
    ));
    jest.mocked(Slot).mockImplementation(mockSlot);

    render(
      <Button asChild>
        <span>Child content</span>
      </Button>
    );

    expect(mockSlot).toHaveBeenCalled();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
