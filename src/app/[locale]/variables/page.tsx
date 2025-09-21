import CustomSidebar from '@/components/layout/sidebar/sidebar';
import EnvironmentVariablesTable from '@/components/layout/variables/env-content';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function VariablesPage() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('authToken')?.value;
  if (!authToken) redirect('/');
  const t = await getTranslations('variables');

  return (
    <main>
      <CustomSidebar className="min-h-120">
        <Heading>
          <h2 className="text-xl font-semibold my-6">{t('title')}</h2>
          <EnvironmentVariablesTable />
        </Heading>
      </CustomSidebar>
    </main>
  );
}
