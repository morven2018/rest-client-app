'use client';
import NavMenu from './nav-menu';
import { UserMenu } from './user-menu';

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function CustomSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <Sidebar
          collapsible="icon"
          {...props}
          className="h-screen sticky top-0"
        >
          <SidebarContent className="flex flex-col h-full">
            <NavMenu />

            <div>
              <UserMenu />
            </div>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <div className="flex-1">{children}</div>
    </div>
  );
}
