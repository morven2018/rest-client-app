import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface NoVariablesProps {
  onAddVariable: () => void;
}

export default function NoVariables({
  onAddVariable,
}: Readonly<NoVariablesProps>) {
  const t = useTranslations('variables');
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-4 text-xl max-[450px]:text-base mb-12 font-medium">
        {t('no-variable')}
      </div>
      <Button
        onClick={onAddVariable}
        className="flex items-center mx-auto flex items-center h-12 bg-violet-800 hover:bg-violet-900 dark:bg-neutral-50 text-white dark:text-violet-800 dark:hover:bg-violet-200 text-xl max-[450px]:text-base px-9 py-2 cursor-pointer"
      >
        {t('add-variable')}
      </Button>
    </div>
  );
}
