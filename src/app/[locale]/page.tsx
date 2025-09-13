import TeamWrapper from '@/components/layout/team/teamWrapper';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('Header');

  return (
    <>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
        <h1>{t('hello')}</h1>
      </div>
      <TeamWrapper />
    </>
  );
}
