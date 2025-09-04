import { getTranslations } from 'next-intl/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TabsDemoProps {
  searchParams: string;
}

export async function FormTab({ searchParams }: Readonly<TabsDemoProps>) {
  const t = await getTranslations('Tabs');
  return (
    <div className="flex w-full max-w-md flex-col gap-6 text-center mx-auto my-30">
      <Tabs
        defaultValue={searchParams}
        className="flex flex-col items-center mx-4"
      >
        <TabsList className="dark:bg-neutral-500">
          <Link href="/login">
            <TabsTrigger
              value="login"
              className="text-violet-950 dark:text-purple-200 dark:data-[state=active]:text-purple-200 dark:data-[state=active]:bg-black"
            >
              {t('login')}
            </TabsTrigger>
          </Link>
          <Link href="/register">
            <TabsTrigger
              value="register"
              className="text-violet-950 dark:text-purple-200  dark:data-[state=active]:text-purple-200 dark:data-[state=active]:bg-black"
            >
              {t('register')}
            </TabsTrigger>
          </Link>
        </TabsList>
        <TabsContent value="login" className="bg-white dark:bg-black">
          <Card>
            <CardHeader>
              <CardTitle className="text-violet-950 dark:text-purple-200">
                {t('login')}
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <span className="text-center">
                {t('access-begin-login')}
                <Link
                  href="/register"
                  className="text-violet-950 dark:text-purple-200"
                >
                  {t('link-login')}
                </Link>
                {t('access-end-login')}
              </span>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="text-violet-950 dark:text-purple-200">
                {t('register')}
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <span className="text-center">
                {t('access-begin-register')}
                <Link
                  href="/login"
                  className="text-violet-950 dark:text-purple-200"
                >
                  {t('link-register')}
                </Link>
                {t('access-end-register')}
              </span>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
