'use client';
import { LogIn, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth/auth-context';
import { useLogout } from '@/hooks/use-logout';
import { useTheme } from '@/hooks/useTheme';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Navigate = () => {
  const t = useTranslations('Header');
  const { authToken, currentUser } = useAuth();
  const { handleLogoutSync } = useLogout();
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

  const isAuthenticated = authToken && currentUser;

  return (
    <>
      <nav className="hidden md:flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Button
              asChild
              variant="outline"
              className="bg-zinc-200 hover:bg-zinc-100 dark:bg-neutral-600 dark:hover:bg-neutral-700"
            >
              <Link href="/login">
                <LogIn />
                {t('login')}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="bg-zinc-200 hover:bg-zinc-100 dark:bg-neutral-600 dark:hover:bg-neutral-700"
            >
              <Link href="/register">{t('register')}</Link>
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="bg-zinc-200 hover:bg-zinc-100 dark:bg-neutral-600 dark:hover:bg-neutral-700"
            onClick={handleLogoutSync}
          >
            <LogOut />
            {t('logout')}
          </Button>
        )}

        <Select value={currentLocale} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[80px] bg-zinc-200 hover:bg-zinc-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 cursor-pointer">
            <SelectValue placeholder="Lang" />
          </SelectTrigger>
          <SelectContent className="min-w-[80px] w-auto ">
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
          className="bg-zinc-200 hover:bg-zinc-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 cursor-pointer "
          onClick={changeTheme}
        >
          {theme === 'light' ? <Sun /> : <Moon />}
        </Button>
      </nav>

      <div className="md:hidden flex items-center">
        <Button
          variant="outline"
          className="bg-zinc-200 dark:bg-neutral-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>

        {isMenuOpen && (
          <div className="absolute top-30 right-0">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="bg-zinc-200 dark:bg-neutral-600"
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
                      className="bg-zinc-200 dark:bg-neutral-600"
                      onClick={closeMenu}
                    >
                      <Link href="/register">{t('register')}</Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="bg-zinc-200 dark:bg-neutral-600"
                    onClick={() => {
                      handleLogoutSync();
                      closeMenu();
                    }}
                  >
                    <LogOut />
                    {t('logout')}
                  </Button>
                )}

                <Select
                  value={currentLocale}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className=" min-w-[80px] w-auto bg-zinc-200 dark:bg-neutral-600">
                    <SelectValue placeholder="Lang" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[80px] w-auto dark:bg-chart-1">
                    <SelectItem value="en">En</SelectItem>
                    <SelectItem value="ru">Ру</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="bg-zinc-200 dark:bg-neutral-600"
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
