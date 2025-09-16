'use client';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface EnvButtonsProps {
  selectedCount: number;
  onAddVariable: () => void;
  onRemoveSelected: () => void;
}

export default function EnvButtons({
  selectedCount,
  onAddVariable,
  onRemoveSelected,
}: Readonly<EnvButtonsProps>) {
  const t = useTranslations('variables');
  return (
    <div className="flex flex-row gap-4 w-full justify-end my-4 px-6 max-[500px]:pl-1 text-sm py-3">
      <Button
        onClick={onAddVariable}
        className="flex items-center gap-2  bg-violet-800 hover:bg-violet-900 dark:bg-neutral-50 text-white dark:text-violet-800 dark:hover:bg-violet-200"
      >
        <Plus className="h-4 w-4" />
        {t('add-variable')}
      </Button>
      {selectedCount > 0 && (
        <Button
          onClick={onRemoveSelected}
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 dark:bg-neutral-50 dark:text-purple-800 dark:hover:bg-purple-200"
          variant="destructive"
        >
          {t('remove')}
        </Button>
      )}
    </div>
  );
}
