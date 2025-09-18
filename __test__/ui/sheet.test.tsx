import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

jest.mock('@radix-ui/react-dialog', () => ({
  Root: jest.fn(({ children, ...props }) => (
    <div data-testid="sheet-root" {...props}>
      {children}
    </div>
  )),
  Trigger: jest.fn(({ children, ...props }) => (
    <button data-testid="sheet-trigger" {...props}>
      {children}
    </button>
  )),
  Close: jest.fn(({ children, ...props }) => (
    <button data-testid="sheet-close" {...props}>
      {children}
    </button>
  )),
  Portal: jest.fn(({ children }) => <>{children}</>),
  Overlay: jest.fn(({ className, ...props }) => (
    <div data-testid="sheet-overlay" className={className} {...props} />
  )),
  Content: jest.fn(({ className, children, ...props }) => (
    <div data-testid="sheet-content" className={className} {...props}>
      {children}
    </div>
  )),
  Title: jest.fn(({ className, ...props }) => (
    <h3 data-testid="sheet-title" className={className} {...props} />
  )),
  Description: jest.fn(({ className, ...props }) => (
    <p data-testid="sheet-description" className={className} {...props} />
  )),
}));

jest.mock('lucide-react', () => ({
  XIcon: jest.fn(({ className, ...props }) => (
    <svg data-testid="x-icon" className={className} {...props} />
  )),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('Sheet Components', () => {
  describe('Sheet', () => {
    it('render with correct props', () => {
      render(
        <Sheet data-testid="sheet">
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>
      );

      expect(screen.getByTestId('sheet')).toBeInTheDocument();
    });
  });

  describe('SheetTrigger', () => {
    it('render with correct props', () => {
      render(<SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>);

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'sheet-trigger');
      expect(trigger).toHaveTextContent('Open Sheet');
    });
  });

  describe('SheetClose', () => {
    it('render with correct props', () => {
      render(<SheetClose data-testid="close">Close</SheetClose>);

      const close = screen.getByTestId('close');
      expect(close).toBeInTheDocument();
      expect(close).toHaveAttribute('data-slot', 'sheet-close');
      expect(close).toHaveTextContent('Close');
    });
  });

  describe('SheetContent', () => {
    it('render with default right side', () => {
      render(
        <SheetContent data-testid="content">
          <div>Sheet Content</div>
        </SheetContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'sheet-content');
      expect(content).toHaveTextContent('Sheet Content');
    });

    it('render with different sides', () => {
      const { rerender } = render(
        <SheetContent side="left" data-testid="content">
          Left Sheet
        </SheetContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();

      rerender(
        <SheetContent side="top" data-testid="content">
          Top Sheet
        </SheetContent>
      );
      expect(content).toBeInTheDocument();

      rerender(
        <SheetContent side="bottom" data-testid="content">
          Bottom Sheet
        </SheetContent>
      );
      expect(content).toBeInTheDocument();
    });

    it('render with custom className', () => {
      render(
        <SheetContent className="custom-class" data-testid="content">
          Content
        </SheetContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('SheetHeader', () => {
    it('render with correct props', () => {
      render(
        <SheetHeader className="custom-class" data-testid="header">
          Header Content
        </SheetHeader>
      );

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'sheet-header');
      expect(header).toHaveClass('custom-class');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('flex-col');
      expect(header).toHaveClass('gap-1.5');
      expect(header).toHaveClass('p-4');
      expect(header).toHaveTextContent('Header Content');
    });
  });

  describe('SheetFooter', () => {
    it('render with correct props', () => {
      render(
        <SheetFooter className="custom-class" data-testid="footer">
          Footer Content
        </SheetFooter>
      );

      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'sheet-footer');
      expect(footer).toHaveClass('custom-class');
      expect(footer).toHaveClass('mt-auto');
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('flex-col');
      expect(footer).toHaveClass('gap-2');
      expect(footer).toHaveClass('p-4');
      expect(footer).toHaveTextContent('Footer Content');
    });
  });

  describe('SheetTitle', () => {
    it('render with correct props', () => {
      render(
        <SheetTitle className="custom-class" data-testid="title">
          Sheet Title
        </SheetTitle>
      );

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'sheet-title');
      expect(title).toHaveClass('custom-class');
      expect(title).toHaveClass('text-foreground');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveTextContent('Sheet Title');
    });
  });

  describe('SheetDescription', () => {
    it('render with correct props', () => {
      render(
        <SheetDescription className="custom-class" data-testid="description">
          Sheet Description
        </SheetDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'sheet-description');
      expect(description).toHaveClass('custom-class');
      expect(description).toHaveClass('text-muted-foreground');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveTextContent('Sheet Description');
    });
  });

  describe('Complete Sheet Usage', () => {
    it('render complete sheet component', () => {
      render(
        <Sheet>
          <SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>
          <SheetContent data-testid="content">
            <SheetHeader data-testid="header">
              <SheetTitle data-testid="title">Title</SheetTitle>
              <SheetDescription data-testid="description">
                Description
              </SheetDescription>
            </SheetHeader>
            <div>Main Content</div>
            <SheetFooter data-testid="footer">
              <SheetClose data-testid="close-button">Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('description')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });
  });

  describe('SheetContent with close button', () => {
    it('render close button', () => {
      render(
        <SheetContent data-testid="content">
          <div>Content</div>
        </SheetContent>
      );

      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });
  });
});
