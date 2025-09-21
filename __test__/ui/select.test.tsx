import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

jest.mock('@radix-ui/react-select', () => {
  const originalModule = jest.requireActual('@radix-ui/react-select');

  return {
    ...originalModule,
    Root: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-root" {...domProps}>
          {children}
        </div>
      );
    }),
    Group: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-group" {...domProps}>
          {children}
        </div>
      );
    }),
    Value: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-value" {...domProps}>
          {children}
        </div>
      );
    }),
    Trigger: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <button data-testid="select-trigger" {...domProps}>
          {children}
        </button>
      );
    }),
    Content: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-content" {...domProps}>
          {children}
        </div>
      );
    }),
    Label: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-label" {...domProps}>
          {children}
        </div>
      );
    }),
    Item: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-item" {...domProps}>
          {children}
        </div>
      );
    }),
    Separator: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-separator" {...domProps}>
          {children}
        </div>
      );
    }),
    ScrollUpButton: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-scroll-up" {...domProps}>
          {children}
        </div>
      );
    }),
    ScrollDownButton: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-scroll-down" {...domProps}>
          {children}
        </div>
      );
    }),
    Icon: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-icon" {...domProps}>
          {children}
        </div>
      );
    }),
    Portal: jest.fn(({ children }) => <>{children}</>),
    Viewport: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-viewport" {...domProps}>
          {children}
        </div>
      );
    }),
    ItemText: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <span data-testid="select-item-text" {...domProps}>
          {children}
        </span>
      );
    }),
    ItemIndicator: jest.fn(({ children, ...props }) => {
      const domProps = { ...props };
      delete domProps.asChild;

      return (
        <div data-testid="select-item-indicator" {...domProps}>
          {children}
        </div>
      );
    }),
  };
});

jest.mock('lucide-react', () => ({
  ChevronDownIcon: jest.fn(({ className, ...props }) => (
    <svg data-testid="chevron-down" className={className} {...props} />
  )),
  ChevronUpIcon: jest.fn(({ className, ...props }) => (
    <svg data-testid="chevron-up" className={className} {...props} />
  )),
  CheckIcon: jest.fn(({ className, ...props }) => (
    <svg data-testid="check-icon" className={className} {...props} />
  )),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('Select Components', () => {
  describe('Select', () => {
    it('render with correct props', () => {
      render(
        <Select data-testid="select">
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByTestId('select')).toBeInTheDocument();
    });
  });

  describe('SelectGroup', () => {
    it('render with correct props', () => {
      render(
        <SelectGroup data-testid="group">
          <SelectLabel>Group Label</SelectLabel>
        </SelectGroup>
      );

      const group = screen.getByTestId('group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('data-slot', 'select-group');
    });
  });

  describe('SelectValue', () => {
    it('render with placeholder', () => {
      render(<SelectValue placeholder="Select option" data-testid="value" />);

      const value = screen.getByTestId('value');
      expect(value).toBeInTheDocument();
      expect(value).toHaveAttribute('data-slot', 'select-value');
    });
  });

  describe('SelectTrigger', () => {
    it('render with default size', () => {
      render(
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
      expect(trigger).toHaveAttribute('data-size', 'default');
    });

    it('render with small size', () => {
      render(
        <SelectTrigger size="sm" data-testid="trigger">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('render with custom className', () => {
      render(
        <SelectTrigger className="custom-class" data-testid="trigger">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass('custom-class');
    });
  });

  describe('SelectContent', () => {
    it('render with popper position', () => {
      render(
        <SelectContent data-testid="content" position="popper">
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'select-content');
    });
  });

  describe('SelectLabel', () => {
    it('render with correct props', () => {
      render(<SelectLabel data-testid="label">Group Label</SelectLabel>);

      const label = screen.getByTestId('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('data-slot', 'select-label');
      expect(label).toHaveTextContent('Group Label');
    });
  });

  describe('SelectItem', () => {
    it('render with correct props', () => {
      render(
        <SelectItem value="1" data-testid="item">
          Option 1
        </SelectItem>
      );

      const item = screen.getByTestId('item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('data-slot', 'select-item');
      expect(item).toHaveTextContent('Option 1');
    });

    it('render with custom className', () => {
      render(
        <SelectItem value="1" className="custom-class" data-testid="item">
          Option 1
        </SelectItem>
      );

      const item = screen.getByTestId('item');
      expect(item).toHaveClass('custom-class');
    });
  });

  describe('SelectSeparator', () => {
    it('render with correct props', () => {
      render(<SelectSeparator data-testid="separator" />);

      const separator = screen.getByTestId('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('data-slot', 'select-separator');
    });
  });

  describe('SelectScrollUpButton', () => {
    it('render with correct props', () => {
      render(<SelectScrollUpButton data-testid="scroll-up" />);

      const scrollUp = screen.getByTestId('scroll-up');
      expect(scrollUp).toBeInTheDocument();
      expect(scrollUp).toHaveAttribute('data-slot', 'select-scroll-up-button');
    });
  });

  describe('SelectScrollDownButton', () => {
    it('render with correct props', () => {
      render(<SelectScrollDownButton data-testid="scroll-down" />);

      const scrollDown = screen.getByTestId('scroll-down');
      expect(scrollDown).toBeInTheDocument();
      expect(scrollDown).toHaveAttribute(
        'data-slot',
        'select-scroll-down-button'
      );
    });
  });

  describe('Complete Usage', () => {
    it('render complete select component', () => {
      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Choose option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Options</SelectLabel>
              <SelectItem value="1">Option 1</SelectItem>
              <SelectItem value="2">Option 2</SelectItem>
              <SelectSeparator />
              <SelectItem value="3">Option 3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
    });
  });
});
