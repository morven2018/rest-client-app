import '@testing-library/jest-dom';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { render, screen } from '@testing-library/react';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';

jest.mock('@radix-ui/react-slot', () => ({
  Slot: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

jest.mock('lucide-react', () => ({
  MoreHorizontal: jest.fn(() => <svg data-testid="more-icon" />),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classNames) => classNames.filter(Boolean).join(' ')),
}));

describe('Breadcrumb', () => {
  describe('Breadcrumb', () => {
    it('render with correct attributes and role', () => {
      render(<Breadcrumb data-testid="breadcrumb">Test</Breadcrumb>);

      const nav = screen.getByTestId('breadcrumb');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
      expect(nav).toHaveAttribute('data-slot', 'breadcrumb');
      expect(nav.tagName).toBe('NAV');
    });

    it('pass through all props', () => {
      render(
        <Breadcrumb className="test-class" id="test-id">
          Test
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('test-class');
      expect(nav).toHaveAttribute('id', 'test-id');
    });
  });

  describe('BreadcrumbList', () => {
    it('render as ordered list with correct classes', () => {
      render(
        <BreadcrumbList data-testid="breadcrumb-list">Test</BreadcrumbList>
      );

      const list = screen.getByTestId('breadcrumb-list');
      expect(list).toBeInTheDocument();
      expect(list.tagName).toBe('OL');
      expect(list).toHaveAttribute('data-slot', 'breadcrumb-list');
    });

    it('merge custom className', () => {
      render(<BreadcrumbList className="custom-class">Test</BreadcrumbList>);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-class');
    });
  });

  describe('BreadcrumbItem', () => {
    it('render as list item with correct classes', () => {
      render(
        <BreadcrumbItem data-testid="breadcrumb-item">Test</BreadcrumbItem>
      );

      const item = screen.getByTestId('breadcrumb-item');
      expect(item).toBeInTheDocument();
      expect(item.tagName).toBe('LI');
      expect(item).toHaveAttribute('data-slot', 'breadcrumb-item');
    });

    it('merge custom className', () => {
      render(<BreadcrumbItem className="custom-class">Test</BreadcrumbItem>);

      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('custom-class');
    });
  });

  describe('BreadcrumbLink', () => {
    it('render as anchor by default', () => {
      render(<BreadcrumbLink href="/test">Test Link</BreadcrumbLink>);

      const link = screen.getByRole('link', { name: 'Test Link' });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('data-slot', 'breadcrumb-link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('render as Slot when asChild is true', () => {
      const mockSlot = jest.fn(({ children, ...props }) => (
        <div {...props}>{children}</div>
      ));
      jest.mocked(Slot).mockImplementation(mockSlot);

      render(
        <BreadcrumbLink asChild>
          <span>Child content</span>
        </BreadcrumbLink>
      );

      expect(mockSlot).toHaveBeenCalled();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('apply hover styles', () => {
      render(<BreadcrumbLink href="/test">Test</BreadcrumbLink>);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('hover:text-foreground');
      expect(link).toHaveClass('transition-colors');
    });
  });

  describe('BreadcrumbPage', () => {
    it('render with correct accessibility attributes', () => {
      render(<BreadcrumbPage>Current Page</BreadcrumbPage>);

      const page = screen.getByText('Current Page');
      expect(page).toBeInTheDocument();
      expect(page).toHaveAttribute('role', 'link');
      expect(page).toHaveAttribute('aria-disabled', 'true');
      expect(page).toHaveAttribute('aria-current', 'page');
      expect(page).toHaveAttribute('data-slot', 'breadcrumb-page');
    });

    it('apply correct styling', () => {
      render(<BreadcrumbPage>Test</BreadcrumbPage>);

      const page = screen.getByRole('link');
      expect(page).toHaveClass('text-foreground');
      expect(page).toHaveClass('font-normal');
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('render default separator when no children provided', () => {
      render(<BreadcrumbSeparator data-testid="separator" />);

      const separator = screen.getByTestId('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'presentation');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveAttribute('data-slot', 'breadcrumb-separator');

      expect(separator.querySelector('svg')).toBeInTheDocument();
    });

    it('render custom children when provided', () => {
      render(<BreadcrumbSeparator>/</BreadcrumbSeparator>);

      const separator = screen.getByText('/');
      expect(separator).toBeInTheDocument();
    });

    it('apply size classes to SVG children', () => {
      render(<BreadcrumbSeparator data-testid="separator" />);

      const separator = screen.getByTestId('separator');
      expect(separator).toHaveClass('[&>svg]:size-3.5');
    });
  });

  describe('BreadcrumbEllipsis', () => {
    it('render with correct accessibility attributes', () => {
      render(<BreadcrumbEllipsis data-testid="ellipsis" />);

      const ellipsis = screen.getByTestId('ellipsis');
      expect(ellipsis).toBeInTheDocument();
      expect(ellipsis).toHaveAttribute('role', 'presentation');
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
      expect(ellipsis).toHaveAttribute('data-slot', 'breadcrumb-ellipsis');
    });

    it('render MoreHorizontal icon', () => {
      render(<BreadcrumbEllipsis />);

      expect(screen.getByTestId('more-icon')).toBeInTheDocument();
    });

    it('include screen reader text', () => {
      render(<BreadcrumbEllipsis />);

      expect(screen.getByText('More')).toBeInTheDocument();
      expect(screen.getByText('More')).toHaveClass('sr-only');
    });

    it('apply correct sizing classes', () => {
      render(<BreadcrumbEllipsis data-testid="ellipsis" />);

      const ellipsis = screen.getByTestId('ellipsis');
      expect(ellipsis).toHaveClass('flex');
      expect(ellipsis).toHaveClass('size-9');
      expect(ellipsis).toHaveClass('items-center');
      expect(ellipsis).toHaveClass('justify-center');
    });
  });
});
