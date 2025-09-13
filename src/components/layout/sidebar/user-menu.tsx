'use client';
import { LogOut, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { UpdateAccountForm } from '../form/update-account-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth/auth-context';
import { useLogout } from '@/hooks/use-logout';
import { Link } from '@/i18n/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@radix-ui/react-dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function UserMenu() {
  const t = useTranslations('user-menu');
  const { currentUser, getAvatar } = useAuth();
  const { handleLogout } = useLogout();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (currentUser?.uid) {
        try {
          const avatarBase64 = await getAvatar(currentUser.uid);
          if (avatarBase64) {
            setAvatarUrl(avatarBase64);
          }
        } catch (error) {
          console.error('Error fetching avatar:', error);
          setAvatarUrl('');
        }
      }
    };

    fetchAvatar();
  }, [currentUser, getAvatar]);

  const handleDialogOpen = () => {
    setIsUpdateDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsUpdateDialogOpen(false);
  };

  if (!currentUser) {
    return null;
  }

  const displayName = currentUser.displayName || currentUser.email || 'User';
  const email = currentUser.email || '';

  if (isMobile) {
    return (
      <div className="flex items-center justify-center w-11.5">
        <div className="flex flex-col items-center gap-2">
          <Link href="/profile">
            <Avatar className="h-8 w-8 rounded-lg">
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl.replaceAll('"', '')}
                  alt={displayName}
                />
              ) : (
                <AvatarFallback className="rounded-lg">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-violet-950 rounded-lg transition-colors bg-black text-white dark:text-black dark:bg-white dark:hover:text-violet-900"
            title={t('logout')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {avatarUrl ? (
                    <AvatarImage
                      src={avatarUrl.replaceAll('"', '')}
                      alt={displayName}
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {avatarUrl ? (
                      <AvatarImage
                        src={avatarUrl.replaceAll('"', '')}
                        alt={displayName}
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  {t('update')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog
        open={isUpdateDialogOpen}
        onOpenChange={(open) =>
          open ? handleDialogOpen() : handleDialogClose()
        }
      >
        <DialogContent className="max-w-md mx-auto">
          <DialogTitle>{t('update')}</DialogTitle>
          <DialogDescription>updateDescription</DialogDescription>

          <UpdateAccountForm
            onSuccess={() => {
              setIsUpdateDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
