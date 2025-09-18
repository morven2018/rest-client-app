import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from '@/components/ui/sidebar';

jest.mock('@/components/ui/separator', () => ({
  Separator: jest.fn(({ className, ...props }) => (
    <div data-testid="separator" className={className} {...props} />
  )),
}));

describe('Sidebar Structure Components', () => {
  it('render SidebarHeader', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Header Content</SidebarHeader>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('render SidebarContent', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Main Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('render SidebarFooter', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarFooter>Footer Content</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('render SidebarSeparator with correct props and classes', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarSeparator className="custom-class" data-testid="separator" />
        </Sidebar>
      </SidebarProvider>
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-slot', 'sidebar-separator');
    expect(separator).toHaveAttribute('data-sidebar', 'separator');
    expect(separator).toHaveClass('custom-class');
    expect(separator).toHaveClass('bg-sidebar-border');
    expect(separator).toHaveClass('mx-2');
    expect(separator).toHaveClass('w-auto');
  });

  it('forward all props to Separator component', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarSeparator
            orientation="horizontal"
            data-testid="separator"
            id="test-separator"
          />
        </Sidebar>
      </SidebarProvider>
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('id', 'test-separator');
  });

  it('render SidebarContent with correct props and classes', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent className="custom-class" data-testid="content">
            Main Content
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveAttribute('data-slot', 'sidebar-content');
    expect(content).toHaveAttribute('data-sidebar', 'content');
    expect(content).toHaveClass('custom-class');
    expect(content).toHaveClass('flex');
    expect(content).toHaveClass('flex-col');
    expect(content).toHaveClass('h-auto');
    expect(content).toHaveClass('gap-2');
    expect(content).toHaveClass('overflow-auto');
    expect(content).toHaveClass(
      'group-data-[collapsible=icon]:overflow-hidden'
    );
    expect(content).toHaveTextContent('Main Content');
  });

  it('forward all props to div element in SidebarContent', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent
            id="test-content"
            data-testid="content"
            style={{ color: 'red' }}
          >
            Content
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveAttribute('id', 'test-content');
    expect(content).toHaveStyle('color: rgb(255, 0, 0)');
  });
});
