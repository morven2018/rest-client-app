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
} from '@/components/ui/sidebar';

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

  it('renders SidebarGroup with label and content', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarGroup>
            <SidebarGroupLabel>Group Label</SidebarGroupLabel>
            <SidebarGroupContent>Group Content</SidebarGroupContent>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Group Label')).toBeInTheDocument();
    expect(screen.getByText('Group Content')).toBeInTheDocument();
  });
});
