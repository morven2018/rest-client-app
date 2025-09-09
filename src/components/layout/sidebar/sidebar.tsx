'use client';
import NavMenu from './nav-menu';

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
    <div className="flex flex-row min-h-100">
      <div className="bg-red-500 relative">
        <SidebarProvider>
          <Sidebar collapsible="icon" {...props} className="h-min">
            <SidebarContent>
              <NavMenu />
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
