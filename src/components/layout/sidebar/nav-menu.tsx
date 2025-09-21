'use client';
import { BookOpen, Settings2, SquareTerminal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

export default function NavMenu() {
  const [isVariablesExpanded, setIsVariablesExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const t = useTranslations('Sidebar');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/variables/')) {
      setIsVariablesExpanded(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMobile && isVariablesExpanded) {
      setIsVariablesExpanded(false);
    }
  }, [isMobile, isVariablesExpanded]);

  const handleVariablesClick = () => {
    router.push('/variables');
  };

  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const isVariablesActive = pathname === '/variables';

  if (isMobile) {
    return (
      <>
        <Link
          href="/restful"
          title={t('rest')}
          className={`p-2 flex self-center ${isActivePath('/restful') ? 'text-violet-700 dark:text-violet-200' : ''}`}
        >
          <SquareTerminal width="16" />
        </Link>

        <Link
          href="/history-and-analytics"
          title={t('history')}
          className={`p-2 flex self-center ${isActivePath('/history-and-analytics') ? 'text-violet-700 dark:text-violet-200' : ''}`}
        >
          <BookOpen width="16" />
        </Link>

        <Link
          href="/variables"
          title={t('variables')}
          className={`p-2 flex self-center ${isVariablesActive || pathname.includes('variable') ? 'text-violet-700 dark:text-violet-200' : ''}`}
        >
          <Settings2 width="16" />
        </Link>
      </>
    );
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActivePath('/restful')}>
          <Link href="/restful" title={t('rest')}>
            <SquareTerminal />
            <span>{t('rest')}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActivePath('/history-and-analytics')}
        >
          <Link href="/history-and-analytics" title={t('history')}>
            <BookOpen />
            <span>{t('history')}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleVariablesClick}
          title={t('variables')}
        >
          <Settings2 />
          <span>{t('variables')}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
