'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { LogIn, Sun, Moon, Menu } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/hooks/useTheme';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

export const Header = () => {
  const t = useTranslations('Header');
  const { theme, toggleTheme } = useTheme();

  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const changeTheme = () => {
    toggleTheme();
  };

  const changeLanguage = (newLocale: string) => {
    const queryParams = searchParams
      ? Object.fromEntries(searchParams.entries())
      : {};
    router.replace({ pathname, query: queryParams }, { locale: newLocale });
  };

  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
  };

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

          <nav className="hidden md:flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/login">
                <LogIn />
                {t('login')}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register">{t('register')}</Link>
            </Button>
            <Select value={currentLocale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent className="min-w-[80px] w-auto">
                <SelectItem value="en">En</SelectItem>
                <SelectItem value="ru">Ру</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={changeTheme}>
              {theme === 'light' ? <Sun /> : <Moon />}
            </Button>
          </nav>
          <div className="md:hidden">
            <Button variant="outline">
              <Menu />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
