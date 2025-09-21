import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import { HistoryList } from '@/components/layout/history/history-content';
import { RequestData } from '@/hooks/use-request';
import { formatDate } from '@/lib/formatter';
import { filterRequests, groupRequestsByDate } from '@/lib/request-utils';

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}));

jest.mock('@/lib/formatter', () => ({
  formatDate: jest.fn(),
}));

jest.mock('@/lib/request-utils', () => ({
  filterRequests: jest.fn(),
  groupRequestsByDate: jest.fn(),
}));

jest.mock('@/components/layout/history/card', () => ({
  RequestCard: jest.fn(({ request }) => (
    <div data-testid="request-card" data-request-id={request.id}>
      {request.method} {request.path}
    </div>
  )),
}));

jest.mock('@/components/ui/custom-separator', () => ({
  CustomSeparator: jest.fn(({ children }) => (
    <div data-testid="custom-separator">{children}</div>
  )),
}));

describe('HistoryList', () => {
  const mockT = jest.fn();
  const mockInitialRequests: RequestData[] = [
    {
      id: '1',
      method: 'GET',
      status: 'ok',
      code: 200,
      variables: {},
      path: '/api/test1',
      url_with_vars: 'http://localhost:3000/api/test1',
      Duration: 100,
      Date: '2024-01-01',
      Time: '12:00:00',
      Request_weight: '1KB',
      Response_weight: '2KB',
      Response: '{}',
      Headers: {},
      Body: '{}',
      errorDetails: '',
      base64Url: '',
    },
    {
      id: '2',
      method: 'POST',
      status: 'error',
      code: 500,
      variables: {},
      path: '/api/test2',
      url_with_vars: 'http://localhost:3000/api/test2',
      Duration: 200,
      Date: '2024-01-02',
      Time: '13:00:00',
      Request_weight: '2KB',
      Response_weight: '3KB',
      Response: '{}',
      Headers: {},
      Body: '{}',
      errorDetails: 'Error',
      base64Url: '',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (getTranslations as jest.Mock).mockResolvedValue(mockT);
    (formatDate as jest.Mock).mockImplementation(
      (date) => `Formatted: ${date}`
    );

    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'no-request': 'No requests found',
        'please-reset': 'Please reset filters',
      };
      return translations[key] || key;
    });
  });

  it('render grouped requests with dates', async () => {
    const mockGroupedRequests = [
      {
        date: '2024-01-01',
        requests: [mockInitialRequests[0]],
      },
      {
        date: '2024-01-02',
        requests: [mockInitialRequests[1]],
      },
    ];

    (filterRequests as jest.Mock).mockReturnValue(mockInitialRequests);
    (groupRequestsByDate as jest.Mock).mockReturnValue(mockGroupedRequests);

    render(await HistoryList({ initialRequests: mockInitialRequests }));

    expect(screen.getByText('Formatted: 2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('Formatted: 2024-01-02')).toBeInTheDocument();
    expect(screen.getAllByTestId('request-card')).toHaveLength(2);
    expect(screen.getAllByTestId('request-card')[0]).toHaveAttribute(
      'data-request-id',
      '1'
    );
  });

  it('apply filters based on searchParams', async () => {
    const searchParams = {
      method: 'GET',
      status: 'ok',
      search: 'test',
    };

    const filteredRequests = [mockInitialRequests[0]];
    const mockGroupedRequests = [
      {
        date: '2024-01-01',
        requests: filteredRequests,
      },
    ];

    (filterRequests as jest.Mock).mockReturnValue(filteredRequests);
    (groupRequestsByDate as jest.Mock).mockReturnValue(mockGroupedRequests);

    render(
      await HistoryList({
        initialRequests: mockInitialRequests,
        searchParams,
      })
    );

    expect(filterRequests).toHaveBeenCalledWith(
      mockInitialRequests,
      searchParams
    );
    expect(screen.getAllByTestId('request-card')).toHaveLength(1);
  });

  it('display empty state when no requests match filters', async () => {
    (filterRequests as jest.Mock).mockReturnValue([]);
    (groupRequestsByDate as jest.Mock).mockReturnValue([]);

    render(await HistoryList({ initialRequests: mockInitialRequests }));

    expect(screen.getByText('No requests found')).toBeInTheDocument();
    expect(screen.getByText('Please reset filters')).toBeInTheDocument();
    expect(screen.queryByTestId('request-card')).not.toBeInTheDocument();
  });

  it('use correct locale for date formatting', async () => {
    const mockGroupedRequests = [
      {
        date: '2024-01-01',
        requests: [mockInitialRequests[0]],
      },
    ];

    (filterRequests as jest.Mock).mockReturnValue([mockInitialRequests[0]]);
    (groupRequestsByDate as jest.Mock).mockReturnValue(mockGroupedRequests);

    render(
      await HistoryList({
        initialRequests: mockInitialRequests,
        locale: 'ru',
      })
    );

    expect(formatDate).toHaveBeenCalledWith('2024-01-01', 'ru');
  });

  it('apply responsive width classes to request cards', async () => {
    const mockGroupedRequests = [
      {
        date: '2024-01-01',
        requests: mockInitialRequests,
      },
    ];

    (filterRequests as jest.Mock).mockReturnValue(mockInitialRequests);
    (groupRequestsByDate as jest.Mock).mockReturnValue(mockGroupedRequests);

    render(await HistoryList({ initialRequests: mockInitialRequests }));

    const cardWrappers = screen.getAllByText('GET /api/test1');
    cardWrappers.forEach((wrapper) => {
      expect(wrapper.parentElement).toHaveClass('w-80');
      expect(wrapper.parentElement).toHaveClass('max-[600px]:w-70');
      expect(wrapper.parentElement).toHaveClass('max-[420px]:w-55');
    });
  });

  it('have correct layout structure', async () => {
    const mockGroupedRequests = [
      {
        date: '2024-01-01',
        requests: [mockInitialRequests[0]],
      },
    ];

    (filterRequests as jest.Mock).mockReturnValue([mockInitialRequests[0]]);
    (groupRequestsByDate as jest.Mock).mockReturnValue(mockGroupedRequests);

    const { container } = render(
      await HistoryList({ initialRequests: mockInitialRequests })
    );

    const mainWrapper = container.firstChild;
    expect(mainWrapper).toHaveClass('space-y-6');
    expect(mainWrapper).toHaveClass('mt-6');

    const innerWrapper = mainWrapper?.firstChild;
    expect(innerWrapper).toHaveClass('space-y-8');
  });

  it('call getTranslations with correct namespace', async () => {
    (filterRequests as jest.Mock).mockReturnValue([]);
    (groupRequestsByDate as jest.Mock).mockReturnValue([]);

    render(await HistoryList({ initialRequests: mockInitialRequests }));

    expect(getTranslations).toHaveBeenCalledWith('history');
  });

  it('handle default parameters correctly', async () => {
    (filterRequests as jest.Mock).mockReturnValue(mockInitialRequests);
    (groupRequestsByDate as jest.Mock).mockReturnValue([
      {
        date: '2024-01-01',
        requests: mockInitialRequests,
      },
    ]);

    render(await HistoryList({ initialRequests: mockInitialRequests }));

    expect(filterRequests).toHaveBeenCalledWith(mockInitialRequests, {});
  });
});
