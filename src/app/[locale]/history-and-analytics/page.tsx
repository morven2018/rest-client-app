import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import HistoryHeading from '@/components/layout/history/history-heading';
import NoHistory from '@/components/layout/history/no-history';
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
  const userId = (await cookieStore).get('userId')?.value;

  if (!authToken || !userId) redirect('/');

  const requests = await getRequests(userId);

  return (
    <main>
      <CustomSidebar className={!requests.length ? 'max-h-40' : 'min-h-120'}>
        {!requests.length && <NoHistory />}
        {!!requests.length && (
          <Heading>
            <HistoryHeading />
            <HistoryFilters searchParams={searchParamsObj} locale={locale} />
            <HistoryList
              initialRequests={requests}
              locale={locale}
              searchParams={searchParamsObj}
            />
          </Heading>
        )}
      </CustomSidebar>
    </main>
  );
}
