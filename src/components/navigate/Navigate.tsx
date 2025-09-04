'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { LogIn, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
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
import { useState, useEffect } from 'react';

export const Navigate = () => {
  const t = useTranslations('Header');
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="hidden md:flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          className="bg-chart-1 dark:bg-chart-1"
        >
          <Link href="/login">
            <LogIn />
            {t('login')}
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="bg-chart-1 dark:bg-chart-1"
        >
          <Link href="/register">{t('register')}</Link>
        </Button>

        <Button
          variant="outline"
          className="bg-chart-1 dark:bg-chart-1 cursor-pointer"
        >
          <LogOut />
          {t('logout')}
        </Button>

        <Select value={currentLocale} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[80px] bg-chart-1 dark:bg-chart-1 cursor-pointer">
            <SelectValue placeholder="Lang" />
          </SelectTrigger>
          <SelectContent className="min-w-[80px] w-auto dark:bg-chart-1">
            <SelectItem className=" cursor-pointer" value="en">
              En
            </SelectItem>
            <SelectItem className="cursor-pointer" value="ru">
              Ру
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="bg-chart-1 dark:bg-chart-1 cursor-pointer"
          onClick={changeTheme}
        >
          {theme === 'light' ? <Sun /> : <Moon />}
        </Button>
      </nav>

      <div className="md:hidden flex items-center">
        <Button
          variant="outline"
          className="bg-chart-1 dark:bg-chart-1 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>

        {isMenuOpen && (
          <div className="absolute top-30 right-0">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="bg-chart-1 dark:bg-chart-1"
                  onClick={closeMenu}
                >
                  <Link href="/login">
                    <LogIn />
                    {t('login')}
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="bg-chart-1 dark:bg-chart-1"
                  onClick={closeMenu}
                >
                  <Link href="/register">{t('register')}</Link>
                </Button>

                <Button
                  variant="outline"
                  className="bg-chart-1 dark:bg-chart-1"
                  onClick={closeMenu}
                >
                  <LogOut />
                  {t('logout')}
                </Button>

                <Select
                  value={currentLocale}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className=" min-w-[80px] w-auto bg-chart-1 dark:bg-chart-1">
                    <SelectValue placeholder="Lang" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[80px] w-auto dark:bg-chart-1">
                    <SelectItem value="en">En</SelectItem>
                    <SelectItem value="ru">Ру</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="bg-chart-1 dark:bg-chart-1 "
                  onClick={() => {
                    changeTheme();
                    closeMenu();
                  }}
                >
                  {theme === 'light' ? <Sun /> : <Moon />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
