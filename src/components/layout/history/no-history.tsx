import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NoHistory() {
  const t = await getTranslations('history');
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex flex-col text-center py-15 max-w-100">
        <div className="text-muted-foreground mb-4 text-xl max-[450px]:text-base mb-12 font-medium">
          {t('no-history1')}
        </div>
        <div className="text-muted-foreground mb-4 text-xl max-[450px]:text-base mb-12 font-medium">
          {t('no-history2')}
        </div>
        <Link
          href="/restful"
          title={t('to-rest')}
          className="flex items-center mx-auto flex items-center h-12 bg-violet-800 hover:bg-violet-900 dark:bg-neutral-50 text-white dark:text-violet-800 dark:hover:bg-violet-200 text-xl max-[450px]:text-base px-9 py-2 cursor-pointer rounded-lg"
        >
          {t('to-rest')}
        </Link>
      </div>
    </div>
  );
}
