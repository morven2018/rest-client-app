import HistoryAndAnalyticsPage from '@/app/[locale]/history-and-analytics/page';
import { render, screen } from '@testing-library/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRequests } from '@/lib/api/firestore-requests';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/components/layout/sidebar/sidebar', () => ({
  __esModule: true,
  default: jest.fn(({ children, className }) => (
    <div className={className} data-testid="sidebar">
      {children}
    </div>
  )),
}));

jest.mock('@/components/layout/breadcrumb-and-heading/heading', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => (
    <div data-testid="heading">{children}</div>
  )),
}));

jest.mock('@/components/layout/history/history-heading', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="history-heading" />),
}));

jest.mock('@/components/layout/history/history-content', () => ({
  HistoryList: jest.fn(() => <div data-testid="history-list" />),
}));

jest.mock('@/components/layout/history/history-filters', () => ({
  HistoryFilters: jest.fn(() => <div data-testid="history-filters" />),
}));

jest.mock('@/components/layout/history/no-history', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="no-history" />),
}));

jest.mock('@/lib/api/firestore-requests', () => ({
  getRequests: jest.fn(),
}));

describe('HistoryAndAnalyticsPage', () => {
  const mockCookies = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockReturnValue(mockCookies);
  });

  it('redirect to home page if no authToken or userId', async () => {
    mockCookies.get.mockImplementation((key: string) => {
      if (key === 'authToken') return { value: undefined };
      if (key === 'userId') return { value: undefined };
      return undefined;
    });

    await HistoryAndAnalyticsPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });

    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('render page with NoHistory component when no requests', async () => {
    mockCookies.get.mockImplementation((key: string) => {
      if (key === 'authToken') return { value: 'test-token' };
      if (key === 'userId') return { value: 'test-user-id' };
      return undefined;
    });

    (getRequests as jest.Mock).mockResolvedValue([]);

    const jsx = await HistoryAndAnalyticsPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });

    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('no-history')).toBeInTheDocument();
    expect(screen.queryByTestId('heading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('history-heading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('history-filters')).not.toBeInTheDocument();
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
  });

  it('render page with history components when requests exist', async () => {
    mockCookies.get.mockImplementation((key: string) => {
      if (key === 'authToken') return { value: 'test-token' };
      if (key === 'userId') return { value: 'test-user-id' };
      return undefined;
    });

    (getRequests as jest.Mock).mockResolvedValue([
      { id: '1', method: 'GET', status: 'ok' },
      { id: '2', method: 'POST', status: 'error' },
    ]);

    const jsx = await HistoryAndAnalyticsPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({
        method: 'GET',
        status: '200',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        sort: 'date',
      }),
    });

    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('history-heading')).toBeInTheDocument();
    expect(screen.getByTestId('history-filters')).toBeInTheDocument();
    expect(screen.getByTestId('history-list')).toBeInTheDocument();
    expect(screen.queryByTestId('no-history')).not.toBeInTheDocument();
  });

  it('call getRequests with correct userId', async () => {
    mockCookies.get.mockImplementation((key: string) => {
      if (key === 'authToken') return { value: 'test-token' };
      if (key === 'userId') return { value: 'test-user-123' };
      return undefined;
    });

    (getRequests as jest.Mock).mockResolvedValue([]);

    await HistoryAndAnalyticsPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });

    expect(redirect).not.toHaveBeenCalled();
    expect(getRequests).toHaveBeenCalledWith('test-user-123');
  });

  it('applies correct className to sidebar based on requests length', async () => {
    mockCookies.get.mockImplementation((key: string) => {
      if (key === 'authToken') return { value: 'test-token' };
      if (key === 'userId') return { value: 'test-user-id' };
      return undefined;
    });

    (getRequests as jest.Mock).mockResolvedValueOnce([]);
    const jsxEmpty = await HistoryAndAnalyticsPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });

    const { rerender } = render(jsxEmpty);
    const sidebarEmpty = screen.getByTestId('sidebar');
    expect(sidebarEmpty).toHaveClass('max-h-40');

    (getRequests as jest.Mock).mockResolvedValueOnce([
      { id: '1', method: 'GET', status: 'ok' },
    ]);
    const jsxWithData = await HistoryAndAnalyticsPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });

    rerender(jsxWithData);
    const sidebarWithData = screen.getByTestId('sidebar');
    expect(sidebarWithData).toHaveClass('min-h-120');
  });
});
