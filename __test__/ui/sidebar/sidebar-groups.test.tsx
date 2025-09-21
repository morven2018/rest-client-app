import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import {
  SidebarProvider,
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

describe('SidebarGroup Components', () => {
  describe('SidebarGroup', () => {
    it('renders with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarGroup className="custom-class" data-testid="group">
              Group Content
            </SidebarGroup>
          </Sidebar>
        </SidebarProvider>
      );

      const group = screen.getByTestId('group');
      expect(group).toHaveAttribute('data-slot', 'sidebar-group');
      expect(group).toHaveAttribute('data-sidebar', 'group');
      expect(group).toHaveClass('custom-class');
      expect(group).toHaveClass('relative');
      expect(group).toHaveClass('flex');
      expect(group).toHaveClass('w-full');
      expect(group).toHaveClass('min-w-0');
      expect(group).toHaveClass('flex-col');
      expect(group).toHaveClass('p-2');
      expect(group).toHaveTextContent('Group Content');
    });
  });

  describe('SidebarGroupLabel', () => {
    it('renders as div with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarGroupLabel className="custom-class" data-testid="label">
              Group Label
            </SidebarGroupLabel>
          </Sidebar>
        </SidebarProvider>
      );

      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('data-slot', 'sidebar-group-label');
      expect(label).toHaveAttribute('data-sidebar', 'group-label');
      expect(label).toHaveClass('custom-class');
      expect(label).toHaveTextContent('Group Label');
    });

    it('forwards all props to div element', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarGroupLabel
              id="test-label"
              data-testid="label"
              title="Label Title"
            >
              Label
            </SidebarGroupLabel>
          </Sidebar>
        </SidebarProvider>
      );

      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('id', 'test-label');
      expect(label).toHaveAttribute('title', 'Label Title');
    });
  });

  describe('SidebarGroupAction', () => {
    it('renders as button with correct props and classes', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarGroupAction
              className="custom-class"
              data-testid="action"
              onClick={handleClick}
            >
              Action
            </SidebarGroupAction>
          </Sidebar>
        </SidebarProvider>
      );

      const action = screen.getByTestId('action');
      expect(action).toHaveAttribute('data-slot', 'sidebar-group-action');
      expect(action).toHaveAttribute('data-sidebar', 'group-action');
      expect(action).toHaveClass('custom-class');
      expect(action).toHaveTextContent('Action');

      await user.click(action);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('forwards all props to the element', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarGroupAction
              id="test-action"
              data-testid="action"
              title="Action Title"
              disabled
            >
              Action
            </SidebarGroupAction>
          </Sidebar>
        </SidebarProvider>
      );

      const action = screen.getByTestId('action');
      expect(action).toHaveAttribute('id', 'test-action');
      expect(action).toHaveAttribute('title', 'Action Title');
      expect(action).toBeDisabled();
    });
  });

  describe('SidebarGroupContent', () => {
    it('renders with correct props and classes', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarGroupContent className="custom-class" data-testid="content">
              Group Content
            </SidebarGroupContent>
          </Sidebar>
        </SidebarProvider>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('data-slot', 'sidebar-group-content');
      expect(content).toHaveAttribute('data-sidebar', 'group-content');
      expect(content).toHaveClass('custom-class');
      expect(content).toHaveClass('w-full');
      expect(content).toHaveClass('text-sm');
      expect(content).toHaveTextContent('Group Content');
    });
  });

  it('renders complete SidebarGroup structure', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarGroup data-testid="group">
            <SidebarGroupLabel data-testid="label">Label</SidebarGroupLabel>
            <SidebarGroupAction data-testid="action">Action</SidebarGroupAction>
            <SidebarGroupContent data-testid="content">
              Content
            </SidebarGroupContent>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('Label');
    expect(screen.getByTestId('action')).toHaveTextContent('Action');
    expect(screen.getByTestId('content')).toHaveTextContent('Content');
  });
});
