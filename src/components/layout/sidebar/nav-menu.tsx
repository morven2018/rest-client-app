'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { Link, useRouter } from '@/i18n/navigation';

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  if (isMobile) {
    return (
      <>
        <Link
          href="/restful"
          title={t('rest')}
          className="p-2 flex self-center"
        >
          <SquareTerminal width="16" />
        </Link>

        <Link
          href="/history-and-analytics"
          title={t('history')}
          className="p-2 flex self-center"
        >
          <BookOpen width="16" />
        </Link>

        <Link
          href="/variables"
          title={t('variables')}
          className="p-2 flex self-center"
        >
          <Settings2 width="16" />
        </Link>
      </>
    );
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/restful" title={t('rest')}>
            <SquareTerminal />
            <span>{t('rest')}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/history-and-analytics" title={t('history')}>
            <BookOpen />
            <span>{t('history')}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isVariablesExpanded}
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
                  <SidebarMenuSubButton asChild>
                    <Link href={`/variables/${env}`}>
                      <span>{env}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={handleAddEnv}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                New Environment
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    </>
  );
}
