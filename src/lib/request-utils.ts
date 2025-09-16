import { RequestData } from '@/hooks/use-request';

export function groupRequestsByDate(requests: RequestData[]) {
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
