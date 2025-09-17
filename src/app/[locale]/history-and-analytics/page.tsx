import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import HistoryHeading from '@/components/layout/history/history-heading';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HistoryList } from '@/components/layout/history/history-content';
import { HistoryFilters } from '@/components/layout/history/history-filters';
import { getRequests } from '@/lib/api/firestore-requests';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    method?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  }>;
}

export default async function HistoryAndAnalyticsPage({
  params,
  searchParams,
}: Readonly<PageProps>) {
  const { locale } = await params;
  const searchParamsObj = await searchParams;
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('authToken')?.value;

  if (!authToken) redirect('/');

  const requests = await getRequests(authToken);

  return (
    <main>
      <CustomSidebar className="min-h-120">
        <Heading>
          <HistoryHeading />
          <HistoryFilters searchParams={searchParamsObj} locale={locale} />
          <HistoryList
            initialRequests={requests}
            locale={locale}
            searchParams={searchParamsObj}
          />
        </Heading>
      </CustomSidebar>
    </main>
  );
}
