import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classNames) => classNames.filter(Boolean).join(' ')),
}));

describe('Skeleton', () => {
  it('render with default classes and data attribute', () => {
    render(<Skeleton data-testid="skeleton">Loading...</Skeleton>);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
    expect(skeleton).toHaveClass('bg-accent');
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded-md');
  });

  it('merge custom className with default classes', () => {
    render(<Skeleton className="custom-class">Loading...</Skeleton>);

    const skeleton = screen.getByText('Loading...');
    expect(skeleton).toHaveClass('custom-class');
  });

  it('pass through all additional props', () => {
    render(
      <Skeleton
        id="test-skeleton"
        aria-label="Loading content"
        style={{ width: '100px' }}
      >
        Loading...
      </Skeleton>
    );

    const skeleton = screen.getByText('Loading...');
    expect(skeleton).toHaveAttribute('id', 'test-skeleton');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    expect(skeleton).toHaveStyle('width: 100px');
  });

  it('render without children', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toBeEmptyDOMElement();
  });
});
