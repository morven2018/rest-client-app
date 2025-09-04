import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Navigate } from '@/components/navigate/Navigate';

export const Header = () => {
  const t = useTranslations('Header');

  return (
    <header className="bg-ring sticky top-0 z-50 w-full">
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
              />
            </Link>
          </h1>

          <Navigate />
        </div>
      </div>
    </header>
  );
};
