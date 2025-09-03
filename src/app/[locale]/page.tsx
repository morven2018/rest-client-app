import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/header/Header';

export default function Home() {
  const t = useTranslations('Header');

  return (
    <>
      <Header />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <h1>{t('hello')}</h1>
      </div>
    </>
  );
}
