import Image from 'next/image';
import { Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const authorsData = [
  {
    name: 'Alena Pudina',
    gitHubLink: 'https://github.com/morven2018',
  },
  {
    name: 'Ihar Batura',
    gitHubLink: 'https://github.com/Ihar-Batura',
  },
  {
    name: 'Yulia Podgurskaia',
    gitHubLink: 'https://github.com/yuliafire',
  },
];

const pages = [
  {
    name: 'Rest Client',
    href: 'restful',
  },
  {
    name: 'Variables',
    href: 'variables',
  },
  {
    name: 'History',
    href: 'history-and-analytics',
  },
];

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-chart-2 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-[17px]">
        <div className="flex flex-wrap justify-center lg:justify-around gap-6 md:gap-8">
          <div className="p-2">
            <h3 className="text-[18px] font-semibold mb-2">{t('command')}</h3>
            {authorsData.map((author) => (
              <div key={author.name} className="flex items-center mb-1 gap-2">
                <h4>{author.name}</h4>
                <Link
                  href={author.gitHubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  <Github />
                </Link>
              </div>
            ))}
          </div>

          <div className="p-2">
            <h3 className="text-[18px] font-semibold mb-2">{t('pages')}</h3>
            {pages.map((page) => (
              <div key={page.name} className="flex items-center mb-1 gap-2">
                <Link href={`/${page.href}`}>{t(`${page.href}`)}</Link>
              </div>
            ))}
          </div>

          <div className="p-2 text-center">
            <h3 className="text-[18px] font-semibold max-w-xs">
              {t('course')}
            </h3>
            <Link
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                src="/logo-rss.svg"
                alt={t('logoAlt')}
                width={64}
                height={104}
                priority
                className="mx-auto"
              />
            </Link>
          </div>
        </div>
        <div className="p-2 mt-3 text-center">{t('right')}</div>
      </div>
    </footer>
  );
};
