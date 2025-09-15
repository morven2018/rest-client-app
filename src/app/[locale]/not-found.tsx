'use client';
import { House, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-[15px] bg-not-found min-h-[500px]">
        <h2 className="p-2 text-center text-[26px] font-semibold mt-[80px] mb-[40px] md:mt-[160px] md:mb-[70px]">
          {t('title')}
        </h2>
        <div
          className="flex flex-wrap 
  justify-center mx-auto 
  max-w-[750px] gap-[40px] mb-[80px] md:mb-[140px]"
        >
          <Button
            variant="outline"
            className="bg-chart-3 dark:bg-chart-3 w-[200px]"
            onClick={handleGoBack}
          >
            <RotateCcw />
            {t('back')}
          </Button>

          <Button
            asChild
            variant="outline"
            className="bg-chart-3 dark:bg-chart-3 w-[200px]"
          >
            <Link href="/">
              <House />
              {t('home')}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
