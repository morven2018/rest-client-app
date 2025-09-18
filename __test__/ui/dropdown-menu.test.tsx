import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: jest.fn(({ children, ...props }) => (
    <div data-testid="dropdown-root" {...props}>
      {children}
    </div>
  )),
  Portal: jest.fn(({ children }) => <>{children}</>),
  Trigger: jest.fn(({ children, ...props }) => (
    <button data-testid="dropdown-trigger" {...props}>
      {children}
    </button>
  )),
  Content: jest.fn(({ className, children, ...props }) => (
    <div data-testid="dropdown-content" className={className} {...props}>
      {children}
    </div>
  )),
  Group: jest.fn(({ children, ...props }) => (
    <div data-testid="dropdown-group" {...props}>
      {children}
    </div>
  )),
  Label: jest.fn(({ className, ...props }) => (
    <div data-testid="dropdown-label" className={className} {...props} />
  )),
  Item: jest.fn(({ className, ...props }) => (
    <div data-testid="dropdown-item" className={className} {...props} />
  )),
  CheckboxItem: jest.fn(({ className, children, ...props }) => (
    <div data-testid="dropdown-checkbox-item" className={className} {...props}>
      {children}
    </div>
  )),
  RadioGroup: jest.fn(({ children, ...props }) => (
    <div data-testid="dropdown-radio-group" {...props}>
      {children}
    </div>
  )),
  RadioItem: jest.fn(({ className, children, ...props }) => (
    <div data-testid="dropdown-radio-item" className={className} {...props}>
      {children}
    </div>
  )),
  Separator: jest.fn(({ className, ...props }) => (
    <div data-testid="dropdown-separator" className={className} {...props} />
  )),
  Sub: jest.fn(({ children, ...props }) => (
    <div data-testid="dropdown-sub" {...props}>
      {children}
    </div>
  )),
  SubTrigger: jest.fn(({ className, children, ...props }) => (
    <div data-testid="dropdown-sub-trigger" className={className} {...props}>
      {children}
    </div>
  )),
  SubContent: jest.fn(({ className, ...props }) => (
    <div data-testid="dropdown-sub-content" className={className} {...props} />
  )),
  ItemIndicator: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('lucide-react', () => ({
  CheckIcon: jest.fn(({ className, ...props }) => (
    <svg data-testid="check-icon" className={className} {...props} />
  )),
  ChevronRightIcon: jest.fn(({ className, ...props }) => (
    <svg data-testid="chevron-right-icon" className={className} {...props} />
  )),
  CircleIcon: jest.fn(({ className, ...props }) => (
    <svg data-testid="circle-icon" className={className} {...props} />
  )),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('DropdownMenu Components', () => {
  describe('DropdownMenu', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenu data-testid="dropdown">
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuPortal', () => {
    it('render with correct props', () => {
      render(<DropdownMenuPortal>Portal Content</DropdownMenuPortal>);

      expect(screen.getByText('Portal Content')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuTrigger', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuTrigger data-testid="trigger">
          Open Menu
        </DropdownMenuTrigger>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
      expect(trigger).toHaveTextContent('Open Menu');
    });
  });

  describe('DropdownMenuContent', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuContent data-testid="content">
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'dropdown-menu-content');
    });

    it('render with custom className', () => {
      render(
        <DropdownMenuContent className="custom-class" data-testid="content">
          Content
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('DropdownMenuGroup', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuGroup data-testid="group">
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuGroup>
      );

      const group = screen.getByTestId('group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('data-slot', 'dropdown-menu-group');
    });
  });

  describe('DropdownMenuLabel', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuLabel data-testid="label">Group Label</DropdownMenuLabel>
      );

      const label = screen.getByTestId('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('data-slot', 'dropdown-menu-label');
      expect(label).toHaveTextContent('Group Label');
    });

    it('render with inset prop', () => {
      render(
        <DropdownMenuLabel inset data-testid="label">
          Inset Label
        </DropdownMenuLabel>
      );

      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('data-inset', 'true');
    });
  });

  describe('DropdownMenuItem', () => {
    it('render with default variant', () => {
      render(<DropdownMenuItem data-testid="item">Menu Item</DropdownMenuItem>);

      const item = screen.getByTestId('item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('data-slot', 'dropdown-menu-item');
      expect(item).toHaveAttribute('data-variant', 'default');
      expect(item).toHaveTextContent('Menu Item');
    });

    it('render with destructive variant', () => {
      render(
        <DropdownMenuItem variant="destructive" data-testid="item">
          Delete
        </DropdownMenuItem>
      );

      const item = screen.getByTestId('item');
      expect(item).toHaveAttribute('data-variant', 'destructive');
    });

    it('render with inset prop', () => {
      render(
        <DropdownMenuItem inset data-testid="item">
          Inset Item
        </DropdownMenuItem>
      );

      const item = screen.getByTestId('item');
      expect(item).toHaveAttribute('data-inset', 'true');
    });
  });

  describe('DropdownMenuCheckboxItem', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuCheckboxItem checked data-testid="checkbox-item">
          Checkbox Item
        </DropdownMenuCheckboxItem>
      );

      const checkboxItem = screen.getByTestId('checkbox-item');
      expect(checkboxItem).toBeInTheDocument();
      expect(checkboxItem).toHaveAttribute(
        'data-slot',
        'dropdown-menu-checkbox-item'
      );
      expect(checkboxItem).toHaveTextContent('Checkbox Item');
    });
  });

  describe('DropdownMenuRadioGroup', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuRadioGroup data-testid="radio-group">
          <DropdownMenuRadioItem value="1">Option 1</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      );

      const radioGroup = screen.getByTestId('radio-group');
      expect(radioGroup).toBeInTheDocument();
      expect(radioGroup).toHaveAttribute(
        'data-slot',
        'dropdown-menu-radio-group'
      );
    });
  });

  describe('DropdownMenuRadioItem', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuRadioItem value="1" data-testid="radio-item">
          Radio Option
        </DropdownMenuRadioItem>
      );

      const radioItem = screen.getByTestId('radio-item');
      expect(radioItem).toBeInTheDocument();
      expect(radioItem).toHaveAttribute(
        'data-slot',
        'dropdown-menu-radio-item'
      );
      expect(radioItem).toHaveTextContent('Radio Option');
    });
  });

  describe('DropdownMenuSeparator', () => {
    it('render with correct props', () => {
      render(<DropdownMenuSeparator data-testid="separator" />);

      const separator = screen.getByTestId('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('data-slot', 'dropdown-menu-separator');
    });
  });

  describe('DropdownMenuShortcut', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuShortcut data-testid="shortcut">⌘K</DropdownMenuShortcut>
      );

      const shortcut = screen.getByTestId('shortcut');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
      expect(shortcut).toHaveTextContent('⌘K');
    });
  });

  describe('DropdownMenuSub', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuSub data-testid="sub">
          <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
        </DropdownMenuSub>
      );

      const sub = screen.getByTestId('sub');
      expect(sub).toBeInTheDocument();
      expect(sub).toHaveAttribute('data-slot', 'dropdown-menu-sub');
    });
  });

  describe('DropdownMenuSubTrigger', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuSubTrigger data-testid="sub-trigger">
          Sub Menu Trigger
        </DropdownMenuSubTrigger>
      );

      const subTrigger = screen.getByTestId('sub-trigger');
      expect(subTrigger).toBeInTheDocument();
      expect(subTrigger).toHaveAttribute(
        'data-slot',
        'dropdown-menu-sub-trigger'
      );
      expect(subTrigger).toHaveTextContent('Sub Menu Trigger');
    });

    it('render with inset prop', () => {
      render(
        <DropdownMenuSubTrigger inset data-testid="sub-trigger">
          Inset Sub Trigger
        </DropdownMenuSubTrigger>
      );

      const subTrigger = screen.getByTestId('sub-trigger');
      expect(subTrigger).toHaveAttribute('data-inset', 'true');
    });
  });

  describe('DropdownMenuSubContent', () => {
    it('render with correct props', () => {
      render(
        <DropdownMenuSubContent data-testid="sub-content">
          <DropdownMenuItem>Sub Item</DropdownMenuItem>
        </DropdownMenuSubContent>
      );

      const subContent = screen.getByTestId('sub-content');
      expect(subContent).toBeInTheDocument();
      expect(subContent).toHaveAttribute(
        'data-slot',
        'dropdown-menu-sub-content'
      );
    });
  });

  it('render complete dropdown menu', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
        <DropdownMenuContent data-testid="content">
          <DropdownMenuGroup data-testid="group">
            <DropdownMenuLabel data-testid="label">Actions</DropdownMenuLabel>
            <DropdownMenuItem data-testid="item">Edit</DropdownMenuItem>
            <DropdownMenuCheckboxItem data-testid="checkbox-item" checked>
              Checkable
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator data-testid="separator" />
            <DropdownMenuRadioGroup data-testid="radio-group">
              <DropdownMenuRadioItem value="1" data-testid="radio-item">
                Option 1
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuShortcut data-testid="shortcut">
              ⌘S
            </DropdownMenuShortcut>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toBeInTheDocument();
    expect(screen.getByTestId('item')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-item')).toBeInTheDocument();
    expect(screen.getByTestId('separator')).toBeInTheDocument();
    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
    expect(screen.getByTestId('radio-item')).toBeInTheDocument();
    expect(screen.getByTestId('shortcut')).toBeInTheDocument();
  });
});
