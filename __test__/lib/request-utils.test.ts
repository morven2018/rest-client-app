import { RequestFilters } from '@/components/layout/history/history-filters';
import { RequestData } from '@/hooks/use-request';
import { filterRequests, groupRequestsByDate } from '@/lib/request-utils';

const baseRequest: Omit<RequestData, 'id' | 'Date' | 'method' | 'status'> = {
  code: 0,
  variables: {},
  path: '',
  url_with_vars: '',
  Duration: 0,
  Time: '',
  Request_weight: '',
  Response_weight: '',
  Response: '',
  Headers: {},
  Body: '',
};

const createRequest = (
  id: string,
  Date: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS',
  status: 'ok' | 'error' | 'in process' | 'not send'
): RequestData => ({
  id,
  Date,
  method,
  status,
  ...baseRequest,
});

describe('groupRequestsByDate', () => {
  const mockRequests: RequestData[] = [
    createRequest('1', '2024-01-01', 'GET', 'ok'),
    createRequest('2', '2024-01-01', 'POST', 'ok'),
    createRequest('3', '2024-01-02', 'GET', 'error'),
    createRequest('4', '2024-01-02', 'PUT', 'ok'),
    createRequest('5', '2024-01-02', 'DELETE', 'in process'),
  ];

  it('group requests on date', () => {
    const result = groupRequestsByDate(mockRequests);

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      date: '2024-01-01',
      requests: [
        createRequest('1', '2024-01-01', 'GET', 'ok'),
        createRequest('2', '2024-01-01', 'POST', 'ok'),
      ],
    });

    expect(result[1]).toEqual({
      date: '2024-01-02',
      requests: [
        createRequest('3', '2024-01-02', 'GET', 'error'),
        createRequest('4', '2024-01-02', 'PUT', 'ok'),
        createRequest('5', '2024-01-02', 'DELETE', 'in process'),
      ],
    });
  });

  it('return empty array for empty input array', () => {
    const result = groupRequestsByDate([]);
    expect(result).toEqual([]);
  });

  it('create separate groups for each unique date', () => {
    const requestsWithUniqueDates: RequestData[] = [
      createRequest('1', '2024-01-01', 'GET', 'ok'),
      createRequest('2', '2024-01-02', 'POST', 'ok'),
      createRequest('3', '2024-01-03', 'PUT', 'error'),
    ];

    const result = groupRequestsByDate(requestsWithUniqueDates);

    expect(result).toHaveLength(3);
    result.forEach((group) => {
      expect(group.requests).toHaveLength(1);
    });
  });
});

describe('filterRequests', () => {
  const mockRequests: RequestData[] = [
    createRequest('1', '2024-01-01', 'GET', 'ok'),
    createRequest('2', '2024-01-02', 'POST', 'ok'),
    createRequest('3', '2024-01-03', 'GET', 'error'),
    createRequest('4', '2024-01-04', 'PUT', 'ok'),
    createRequest('5', '2024-01-05', 'DELETE', 'error'),
  ];

  it('return all queries with empty filters', () => {
    const filters: RequestFilters = {};
    const result = filterRequests(mockRequests, filters);

    expect(result).toEqual(mockRequests);
  });

  it('filter by method', () => {
    const filters: RequestFilters = { method: 'GET' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toHaveLength(2);
    expect(result.every((req) => req.method === 'GET')).toBe(true);
  });

  it('filter by status', () => {
    const filters: RequestFilters = { status: 'ok' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toHaveLength(3);
    expect(result.every((req) => req.status === 'ok')).toBe(true);
  });

  it('filter by the "all" method', () => {
    const filters: RequestFilters = { method: 'all' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toEqual(mockRequests);
  });

  it('filter by the "all" status', () => {
    const filters: RequestFilters = { status: 'all' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toEqual(mockRequests);
  });

  it('filter by date "from"', () => {
    const filters: RequestFilters = { dateFrom: '2024-01-03' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toHaveLength(3);
    expect(result.map((req) => req.id)).toEqual(['3', '4', '5']);
  });

  it('filter by date "to"', () => {
    const filters: RequestFilters = { dateTo: '2024-01-03' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toHaveLength(3);
    expect(result.map((req) => req.id)).toEqual(['1', '2', '3']);
  });

  it('filter by date range', () => {
    const filters: RequestFilters = {
      dateFrom: '2024-01-02',
      dateTo: '2024-01-04',
    };
    const result = filterRequests(mockRequests, filters);

    expect(result).toHaveLength(3);
    expect(result.map((req) => req.id)).toEqual(['2', '3', '4']);
  });

  it('filter by method and status combination', () => {
    const filters: RequestFilters = { method: 'GET', status: 'ok' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filter by a combination of all filters', () => {
    const filters: RequestFilters = {
      method: 'GET',
      status: 'error',
      dateFrom: '2024-01-02',
      dateTo: '2024-01-04',
    };
    const result = filterRequests(mockRequests, filters);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('return an empty array if there is no match', () => {
    const filters: RequestFilters = { method: 'PATCH', status: 'not send' };
    const result = filterRequests(mockRequests, filters);

    expect(result).toEqual([]);
  });
});
