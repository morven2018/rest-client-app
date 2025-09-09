import { BookOpen, Settings2, SquareTerminal } from 'lucide-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { Link, useRouter } from '@/i18n/navigation';

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
  const envList = getEnv();
  const t = useTranslations('Sidebar');
  const router = useRouter();

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

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/restful">
            <SquareTerminal />
            <span>{t('rest')}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/history-and-analytics">
            <BookOpen />
            <span>{t('history')}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isVariablesExpanded}
          onClick={() => setIsVariablesExpanded(!isVariablesExpanded)}
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
            {envList.length === 0 &&
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
