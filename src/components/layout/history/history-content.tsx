import { RequestCard } from './card';
import { CustomSeparator } from '@/components/ui/custom-separator';
import { RequestData } from '@/hooks/use-request';
import { formatDate } from '@/lib/formatter';
import { groupRequestsByDate } from '@/lib/request-utils';

interface HistoryListProps {
  initialRequests: RequestData[];
  locale?: string;
}

export async function HistoryList({
  initialRequests,
  locale = 'en',
}: Readonly<HistoryListProps>) {
  const groupedRequests = groupRequestsByDate(initialRequests);

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
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No Data
          </div>
        )}
      </div>
    </div>
  );
}
