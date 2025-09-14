'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export default function NavMenu() {
  const { getEnv, addEnv } = useEnvVariables();
  const [isVariablesExpanded, setIsVariablesExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const envList = getEnv();
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

  const handleAddEnv = () => {
    let newEnvName = 'new-environment';
    let counter = 1;

    while (envList.includes(newEnvName)) {
      newEnvName = `new-environment ${counter}`;
      counter++;
    }

    addEnv(newEnvName);

    router.push(`/variables/${newEnvName}`);
  };

  const handleVariablesClick = () => {
    if (isMobile) {
      router.push('/variables');
    } else {
      setIsVariablesExpanded(!isVariablesExpanded);
    }
  };

  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const isActiveEnv = (env: string) => {
    const decodedPathname = decodeURIComponent(pathname);
    const expectedPath = `/variables/${env}`;
    return decodedPathname === expectedPath;
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
          isActive={isVariablesActive}
          onClick={handleVariablesClick}
          title={t('variables')}
        >
          <Settings2 />
          <span>{t('variables')}</span>
          {isVariablesExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </SidebarMenuButton>

        {isVariablesExpanded && (
          <SidebarMenuSub>
            {!!envList.length &&
              envList.map((env) => (
                <SidebarMenuSubItem key={env}>
                  <SidebarMenuSubButton asChild isActive={isActiveEnv(env)}>
                    <Link href={`/variables/${env}`}>
                      <span>{env}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={handleAddEnv}
                className="flex items-center gap-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-900"
              >
                + New Environment
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    </>
  );
}
