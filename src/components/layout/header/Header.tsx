'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Navigate } from '@/components/navigate/Navigate';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations('Header');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled
          ? 'bg-neutral-500 dark:bg-slate-300'
          : 'bg-neutral-400 dark:bg-slate-200'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-[15px]">
        <div className="flex h-16 items-center justify-between">
          <h1 className="flex items-center">
            <Link className="flex items-center" href="/">
              <Image
                src="/logo.svg"
                alt={t('logoAlt')}
                width={110}
                height={90}
                priority
                data-testid="header-logo"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </h1>

          <Navigate />
        </div>
      </div>
    </header>
  );
};
