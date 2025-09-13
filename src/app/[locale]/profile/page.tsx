'use client';
import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AuthWrapper } from '@/components/layout/auth-redirection/auth-wrapper';
import { UpdateAccountForm } from '@/components/layout/form/update-account-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastSuccess } from '@/components/ui/sonner';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const handleSuccess = () => {
    toastSuccess(t('success'));
  };

  return (
    <AuthWrapper>
      <main className="container mx-auto pt-4 pb-10 max-w-md">
        <div className="p-4">
          <Button variant="ghost" size="icon" asChild title={t('home-btn')}>
            <Link href="/">
              <Home width="20px" />
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-violet-950 dark:text-purple-200 text-lg text-center">
              {t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateAccountForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </main>
    </AuthWrapper>
  );
}
