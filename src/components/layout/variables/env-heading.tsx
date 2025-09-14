'use client';
import * as React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { usePathname, useRouter } from '@/i18n/navigation';
import { formatBreadcrumbName } from '@/lib/formatter';

export default function EnvHeading() {
  const pathname = usePathname();
  const links = pathname.split('/').filter(Boolean);
  const router = useRouter();

  // Декодируем имя из URL сразу
  const currentEnvName = links[1] ? decodeURIComponent(links[1]) : '';
  const [value, setValue] = useState(
    formatBreadcrumbName(currentEnvName || 'New environment')
  );

  const { environmentExists, addEnv, renameEnv } = useEnvVariables();
  const envExists = environmentExists(currentEnvName);

  const t = useTranslations('variables');

  const handleAddEnvironment = () => {
    // В localStorage храним обычное имя
    addEnv(value, {});
    // В URL кодируем только для перехода
    const newPath = `/variables/${encodeURIComponent(value)}`;
    router.push(newPath);
  };

  const handleUpdateEnvironment = () => {
    if (value !== currentEnvName) {
      // Переименовываем в localStorage
      renameEnv(currentEnvName, value);
      // Обновляем URL с закодированным именем
      const newPath = `/variables/${encodeURIComponent(value)}`;
      router.push(newPath);
    }
  };

  return (
    <div>
      <div className="mb-4 mt-2 flex flex-row">
        <Input
          id="pathname-input"
          type="text"
          value={value}
          className="max-w-64 flex flex-1 px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-md bg-gray-50 text-lg"
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              if (envExists) {
                handleUpdateEnvironment();
              } else {
                handleAddEnvironment();
              }
            }
          }}
        />
        {envExists && (
          <Button
            onClick={handleUpdateEnvironment}
            size="icon"
            variant="outline"
            className="ml-2 dark:border-neutral-600 dark:hover:bg-neutral-700"
            title={t('update')}
          >
            <RefreshCw className="h-4 w-4 max-[380px]:w-3 max-[380px]:h-3 " />
          </Button>
        )}
        {!envExists && currentEnvName && (
          <Button
            onClick={handleAddEnvironment}
            size="icon"
            variant="outline"
            className="ml-2 dark:border-neutral-600 dark:hover:bg-neutral-700"
            title={t('add')}
          >
            <Plus className="h-4 w-4 max-[380px]:w-3 max-[380px]:h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
