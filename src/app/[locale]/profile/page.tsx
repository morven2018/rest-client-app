'use client';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AuthWrapper } from '@/components/layout/auth-redirection/auth-wrapper';
import { UpdateAccountForm } from '@/components/layout/form/update-account-form';
import { Button } from '@/components/ui/button';
import { toastSuccess } from '@/components/ui/sonner';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const handleSuccess = () => {
    toastSuccess(t('success'));
  };

  return (
    <AuthWrapper>
      <div className="container mx-auto py-8 max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <Home width="20px" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">{'title'}</h1>
          <UpdateAccountForm onSuccess={handleSuccess} />
        </div>
      </div>
    </AuthWrapper>
  );
}
