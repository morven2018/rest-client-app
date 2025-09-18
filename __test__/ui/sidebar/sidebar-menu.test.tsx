import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

const mockUseSidebar = jest.fn();
jest.mock('@/components/ui/sidebar', () => {
  const originalModule = jest.requireActual('@/components/ui/sidebar');
  return {
    ...originalModule,
    useSidebar: () => mockUseSidebar(),
  };
});

describe('SidebarMenu Components', () => {
  beforeEach(() => {
    mockUseSidebar.mockReturnValue({
      isMobile: false,
      state: 'expanded',
    });
  });

  describe('SidebarMenu', () => {
    it('render with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu className="custom-class" data-testid="menu">
              <li>Item</li>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const menu = screen.getByTestId('menu');
      expect(menu).toHaveAttribute('data-slot', 'sidebar-menu');
      expect(menu).toHaveAttribute('data-sidebar', 'menu');
      expect(menu).toHaveClass('custom-class');
      expect(menu).toHaveClass('flex');
      expect(menu).toHaveClass('w-full');
      expect(menu).toHaveClass('min-w-0');
      expect(menu).toHaveClass('flex-col');
      expect(menu).toHaveClass('gap-1');
    });
  });

  describe('SidebarMenuItem', () => {
    it('render with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem className="custom-class" data-testid="item">
                Item Content
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const item = screen.getByTestId('item');
      expect(item).toHaveAttribute('data-slot', 'sidebar-menu-item');
      expect(item).toHaveAttribute('data-sidebar', 'menu-item');
      expect(item).toHaveClass('custom-class');
      expect(item).toHaveClass('group/menu-item');
      expect(item).toHaveClass('relative');
      expect(item).toHaveTextContent('Item Content');
    });
  });

  describe('SidebarMenuButton', () => {
    it('render with default variant and size', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton data-testid="button">
                  Button Text
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-slot', 'sidebar-menu-button');
      expect(button).toHaveAttribute('data-sidebar', 'menu-button');
      expect(button).toHaveAttribute('data-size', 'default');
      expect(button).toHaveAttribute('data-active', 'false');
      expect(button).toHaveTextContent('Button Text');
    });

    it('render with active state', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive data-testid="button">
                  Active Button
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-active', 'true');
    });

    it('render with different variant and size', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="outline"
                  size="lg"
                  data-testid="button"
                >
                  Large Outline
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-size', 'lg');
    });

    it('render with tooltip when sidebar is collapsed', () => {
      mockUseSidebar.mockReturnValue({
        isMobile: false,
        state: 'collapsed',
      });

      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Tooltip text" data-testid="button">
                  Button with Tooltip
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button with Tooltip');
    });
  });

  describe('SidebarMenuAction', () => {
    it('render with correct props and classes', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Button</SidebarMenuButton>
                <SidebarMenuAction
                  onClick={handleClick}
                  data-testid="action"
                  className="custom-class"
                >
                  Action
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const action = screen.getByTestId('action');
      expect(action).toHaveAttribute('data-slot', 'sidebar-menu-action');
      expect(action).toHaveAttribute('data-sidebar', 'menu-action');
      expect(action).toHaveClass('custom-class');
      expect(action).toHaveTextContent('Action');

      await user.click(action);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('render with showOnHover prop', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Button</SidebarMenuButton>
                <SidebarMenuAction showOnHover data-testid="action">
                  Action
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const action = screen.getByTestId('action');
      expect(action).toHaveClass('md:opacity-0');
    });
  });

  describe('SidebarMenuBadge', () => {
    it('render with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Button</SidebarMenuButton>
                <SidebarMenuBadge className="custom-class" data-testid="badge">
                  5
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-slot', 'sidebar-menu-badge');
      expect(badge).toHaveAttribute('data-sidebar', 'menu-badge');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveTextContent('5');
    });
  });

  describe('SidebarMenuSkeleton', () => {
    it('render with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuSkeleton
                className="custom-class"
                data-testid="skeleton"
                showIcon
              />
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-slot', 'sidebar-menu-skeleton');
      expect(skeleton).toHaveAttribute('data-sidebar', 'menu-skeleton');
      expect(skeleton).toHaveClass('custom-class');
      expect(skeleton).toHaveClass('flex');
      expect(skeleton).toHaveClass('h-8');
      expect(skeleton).toHaveClass('items-center');
      expect(skeleton).toHaveClass('gap-2');
      expect(skeleton).toHaveClass('rounded-md');
      expect(skeleton).toHaveClass('px-2');
    });
  });

  describe('SidebarMenuSub', () => {
    it('render with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuSub className="custom-class" data-testid="sub">
                <li>Sub Item</li>
              </SidebarMenuSub>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const sub = screen.getByTestId('sub');
      expect(sub).toHaveAttribute('data-slot', 'sidebar-menu-sub');
      expect(sub).toHaveAttribute('data-sidebar', 'menu-sub');
      expect(sub).toHaveClass('custom-class');
      expect(sub).toHaveClass('border-sidebar-border');
      expect(sub).toHaveClass('mx-3.5');
      expect(sub).toHaveClass('flex');
      expect(sub).toHaveClass('min-w-0');
      expect(sub).toHaveClass('translate-x-px');
      expect(sub).toHaveClass('flex-col');
      expect(sub).toHaveClass('gap-1');
      expect(sub).toHaveClass('border-l');
      expect(sub).toHaveClass('px-2.5');
      expect(sub).toHaveClass('py-0.5');
    });
  });

  describe('SidebarMenuSubItem', () => {
    it('render with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuSub>
                <SidebarMenuSubItem
                  className="custom-class"
                  data-testid="sub-item"
                >
                  Sub Item Content
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const subItem = screen.getByTestId('sub-item');
      expect(subItem).toHaveAttribute('data-slot', 'sidebar-menu-sub-item');
      expect(subItem).toHaveAttribute('data-sidebar', 'menu-sub-item');
      expect(subItem).toHaveClass('custom-class');
      expect(subItem).toHaveClass('group/menu-sub-item');
      expect(subItem).toHaveClass('relative');
      expect(subItem).toHaveTextContent('Sub Item Content');
    });
  });
  describe('SidebarMenuSubButton', () => {
    it('render with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    data-testid="sub-button"
                    className="custom-class"
                    size="md"
                    isActive
                  >
                    Sub Button
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const subButton = screen.getByTestId('sub-button');
      expect(subButton).toHaveAttribute('data-slot', 'sidebar-menu-sub-button');
      expect(subButton).toHaveAttribute('data-sidebar', 'menu-sub-button');
      expect(subButton).toHaveAttribute('data-size', 'md');
      expect(subButton).toHaveAttribute('data-active', 'true');
      expect(subButton).toHaveClass('custom-class');
      expect(subButton).toHaveTextContent('Sub Button');
    });
    it('render with different size', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarMenu>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton size="sm" data-testid="sub-button">
                    Small Button
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      );

      const subButton = screen.getByTestId('sub-button');
      expect(subButton).toHaveAttribute('data-size', 'sm');
      expect(subButton).toHaveClass('text-xs');
    });
  });
});
