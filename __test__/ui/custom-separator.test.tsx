import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomSeparator } from '@/components/ui/custom-separator';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('CustomSeparator', () => {
  it('render without children', () => {
    render(
      <CustomSeparator className="custom-class" data-testid="separator" />
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('custom-class');
    expect(separator).toHaveClass('relative');
    expect(separator).toHaveClass('flex');
    expect(separator).toHaveClass('items-center');
    expect(separator).toHaveClass('py-4');

    // Should have two border lines
    const lines = separator.querySelectorAll('.border-t');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveClass('flex-grow');
    expect(lines[0]).toHaveClass('border-border');
    expect(lines[1]).toHaveClass('flex-grow');
    expect(lines[1]).toHaveClass('border-border');
  });

  it('render with children', () => {
    render(
      <CustomSeparator data-testid="separator">
        Or continue with
      </CustomSeparator>
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();

    // Should have text content
    expect(separator).toHaveTextContent('Or continue with');

    // Should have the text element with correct classes
    const textElement = screen.getByText('Or continue with');
    expect(textElement).toHaveClass('mx-3');
    expect(textElement).toHaveClass('flex-shrink');
    expect(textElement).toHaveClass('text-sm');
    expect(textElement).toHaveClass('text-muted-foreground');

    // Should have two border lines
    const lines = separator.querySelectorAll('.border-t');
    expect(lines).toHaveLength(2);
  });

  it('render with React node children', () => {
    render(
      <CustomSeparator data-testid="separator">
        <span data-testid="custom-child">Custom Text</span>
      </CustomSeparator>
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();

    // Should have custom child element
    const customChild = screen.getByTestId('custom-child');
    expect(customChild).toBeInTheDocument();
    expect(customChild).toHaveTextContent('Custom Text');
  });
});
