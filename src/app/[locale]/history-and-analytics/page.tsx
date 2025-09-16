import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import HistoryHeading from '@/components/layout/history/history-heading';
import { cookies } from 'next/headers';
import { HistoryList } from '@/components/layout/history/history-content';
import { getRequests } from '@/lib/api/firestore-requests';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HistoryAndAnalyticsPage({
  params,
}: Readonly<PageProps>) {
  const { locale } = await params;
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('authToken')?.value;

  const requests = await getRequests(authToken);

  return (
    <main>
      <CustomSidebar className="min-h-120">
        <Heading>
          <HistoryHeading />
          <HistoryList initialRequests={requests} locale={locale} />
        </Heading>
      </CustomSidebar>
    </main>
  );
}
