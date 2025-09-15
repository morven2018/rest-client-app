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
      <div className="p-4 relative max-[380px]:px-1">
        <SidebarProvider>
          <Sidebar
            collapsible="icon"
            {...props}
            className="h-screen sticky top-0 p-4 max-[900px]:px-1.5 rounded-lg bg-neutral-100 dark:bg-zinc-950"
          >
            <SidebarContent className="flex flex-col h-full">
              <NavMenu />

              <div>
                <UserMenu />
              </div>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
      <div className="flex-1 bg-neutral-100 dark:bg-zinc-950 rounded-lg my-4 mr-4">
        {children}
      </div>
    </div>
  );
}
