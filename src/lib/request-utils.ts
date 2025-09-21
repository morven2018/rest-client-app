import { RequestFilters } from '@/components/layout/history/history-filters';
import { RequestData } from '@/hooks/use-request';

export function groupRequestsByDate(
  requests: RequestData[]
): { date: string; requests: RequestData[] }[] {
  const groups: { date: string; requests: RequestData[] }[] = [];

  requests.forEach((request) => {
    const existingGroup = groups.find((group) => group.date === request.Date);

    if (existingGroup) {
      existingGroup.requests.push(request);
    } else {
      groups.push({
        date: request.Date,
        requests: [request],
      });
    }
  });

  return groups;
}

export function filterRequests(
  requests: RequestData[],
  filters: RequestFilters
): RequestData[] {
  return requests.filter((request) => {
    const matchesMethod =
      !filters.method ||
      filters.method === 'all' ||
      request.method === filters.method;

    const matchesStatus =
      !filters.status ||
      filters.status === 'all' ||
      request.status === filters.status;

    let matchesDate = true;
    if (filters.dateFrom) {
      const requestDate = new Date(request.Date);
      const fromDate = new Date(filters.dateFrom);
      matchesDate = matchesDate && requestDate >= fromDate;
    }
    if (filters.dateTo) {
      const requestDate = new Date(request.Date);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      matchesDate = matchesDate && requestDate <= toDate;
    }

    return matchesMethod && matchesStatus && matchesDate;
  });
}

export interface RequestMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  requestSize: number;
  responseSize: number;
}

export interface PreparedRequest {
  url: string;
  body: string;
  headers: Record<string, string>;
  shouldSendBody: boolean;
}
