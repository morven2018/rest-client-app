import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function HistoryHeading() {
  const t = await getTranslations('history');

  return (
    <div className="flex flex-row py-5 px-6 justify-between items-center">
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <Link
        href="/restful"
        title={t('to-rest')}
        className="bg-violet-200 hover:bg-violet-300 px-4 py-2 rounded-lg"
      >
        {t('to-rest')}
      </Link>
    </div>
  );
}
