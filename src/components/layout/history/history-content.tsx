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
            <div className="flex flex-wrap gap-4 justify-center">
              {group.requests.map((request) => (
                <div
                  key={request.id}
                  className="w-80 max-[600px]:w-70 max-[420px]:w-55"
                >
                  <RequestCard request={request} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {groupedRequests.length === 0 && (
          <div className="text-center py-12 text-xl font-medium">
            <div>{t('no-request')}</div>
            <div className="mt-2">{t('please-reset')}</div>
          </div>
        )}
      </div>
    </div>
  );
}
