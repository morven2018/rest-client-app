import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function HistoryHeading() {
  const t = await getTranslations('history');

  return (
    <div className="flex flex-row">
      <h2>{t('title')}</h2>
      <Link href="/restful" title={t('to-rest')}>
        {t('to-rest')}
      </Link>
    </div>
  );
}
