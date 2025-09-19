'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/context/auth/auth-context';
import { useTranslations } from 'next-intl';

export default function GreetingsSection() {
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName;
  const t = useTranslations('Greetings');

  const buttonStyles =
    'bg-zinc-200 hover:bg-zinc-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 w-28';

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container w-full min-h-150 space-y-4 mx-auto bg-greetings px-7 py-20 rounded-[8px] flex justify-center items-center">
        <div className="inline-block px-8 py-16 rounded-[8px] bg-[#FFFFFFB2] dark:bg-[#0A0A0AB2]">
          <h3 className="text-center text-3xl sm:text-5xl font-semibold leading-tight tracking-normal mb-10">
            {displayName ? `${t('title')}, ${displayName}!` : `${t('title')}!`}
          </h3>
          <p className="text-center font-semibold mb-10">{t('descriptions')}</p>
          {displayName ? (
            <div className="flex gap-4 flex-col items-center md:justify-center md:flex-row">
              <Button asChild variant="outline" className={buttonStyles}>
                <Link href="/restful">{t('btnRest')}</Link>
              </Button>

              <Button asChild variant="outline" className={buttonStyles}>
                <Link href="/history-and-analytics">{t('btnHistory')}</Link>
              </Button>

              <Button asChild variant="outline" className={buttonStyles}>
                <Link href="/variables">{t('btnVariables')}</Link>
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 flex-col items-center md:justify-center md:flex-row">
              <Button asChild variant="outline" className={buttonStyles}>
                <Link href="/login">{t('btnLogin')}</Link>
              </Button>

              <Button asChild variant="outline" className={buttonStyles}>
                <Link href="/register">{t('btnRegister')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
