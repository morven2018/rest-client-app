import { getTranslations } from 'next-intl/server';
import { RequestCard } from './card';
import { CustomSeparator } from '@/components/ui/custom-separator';
import { RequestData } from '@/hooks/use-request';
import { formatDate } from '@/lib/formatter';
import { filterRequests, groupRequestsByDate } from '@/lib/request-utils';

interface HistoryListProps {
  initialRequests: RequestData[];
  locale?: string;
  searchParams?: {
    method?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  };
}

export async function HistoryList({
  initialRequests,
  locale = 'en',
  searchParams = {},
}: Readonly<HistoryListProps>) {
  const filteredRequests = filterRequests(initialRequests, searchParams);
  const groupedRequests = groupRequestsByDate(filteredRequests);
  const t = await getTranslations('history');

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-8">
        {groupedRequests.map((group) => (
          <div key={group.date}>
            <CustomSeparator>{formatDate(group.date, locale)}</CustomSeparator>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        ))}

        {groupedRequests.length === 0 && (
          <>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t('no-request')}
            </div>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t('please-reset')}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
