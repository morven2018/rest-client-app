import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import { getTranslations } from 'next-intl/server';

export default async function VariablesPage() {
  const t = await getTranslations('variables');
  return (
    <main>
      <CustomSidebar className="min-h-150">
        <Heading>
          <h2 className="text-xl font-semibold my-6">{t('title')}</h2>
        </Heading>
      </CustomSidebar>
    </main>
  );
}
