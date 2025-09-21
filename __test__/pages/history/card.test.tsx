import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { RequestCard } from '@/components/layout/history/card';
import { RequestData } from '@/hooks/use-request';

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      'request-card.duration': 'Duration',
      'request-card.ms': 'ms',
      'request-card.date': 'Date',
      'request-card.time': 'Time',
      'request-card.request': 'Request',
      'request-card.response': 'Response',
      'request-card.view-details': 'View Details',
      'request-card.detail': 'Error Details',
    };
    return translations[key] || key;
  }),
}));

jest.mock('next/link', () => {
  function MockLink({
    children,
    href,
  }: Readonly<{
    children: React.ReactNode;
    href: string;
  }>) {
    return <a href={href}>{children}</a>;
  }
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant: string;
  }) => <span data-variant={variant}>{children}</span>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-value={value}>{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('RequestCard', () => {
  const mockRequest: RequestData = {
    id: '1',
    method: 'GET',
    status: 'ok',
    code: 200,
    url_with_vars: 'https://api.example.com/users',
    Duration: 150,
    Date: '2023-12-01',
    Time: '14:30:25',
    Request_weight: '1.2 KB',
    Response_weight: '5.7 KB',
    base64Url: '/details',
    errorDetails: '',
    variables: {},
    path: '',
    Response: '',
    Headers: {},
    Body: '',
  };

  const mockErrorRequest: RequestData = {
    ...mockRequest,
    status: 'error',
    code: 404,
    errorDetails: 'Not found error details',
  };

  const mockInProcessRequest: RequestData = {
    ...mockRequest,
    status: 'in process',
    code: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render successfully with ok status', async () => {
    render(await RequestCard({ request: mockRequest }));

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(
      screen.getByText('https://api.example.com/users')
    ).toBeInTheDocument();
    expect(screen.getByText('150 ms')).toBeInTheDocument();
    expect(screen.getByText('2023-12-01')).toBeInTheDocument();
    expect(screen.getByText('14:30:25')).toBeInTheDocument();
    expect(screen.getByText('1.2 KB')).toBeInTheDocument();
    expect(screen.getByText('5.7 KB')).toBeInTheDocument();
  });

  it('render successfully with error status', async () => {
    render(await RequestCard({ request: mockErrorRequest }));

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('ERROR')).toBeInTheDocument();
    expect(screen.getByText('detail')).toBeInTheDocument();
  });

  it('render successfully with in process status', async () => {
    render(await RequestCard({ request: mockInProcessRequest }));

    expect(screen.getByText('IN PROCESS')).toBeInTheDocument();
    expect(screen.getAllByText('-')[0]).toBeInTheDocument();
    expect(screen.getAllByText('-')[1]).toBeInTheDocument();
  });

  it('applies correct badge variant based on status', async () => {
    const { container } = render(await RequestCard({ request: mockRequest }));
    const badge = container.querySelector('[data-variant]');
    expect(badge).toHaveAttribute('data-variant', 'ok');
  });

  it('show error details accordion only for error status', async () => {
    const { rerender } = render(
      await RequestCard({ request: mockErrorRequest })
    );
    expect(screen.getByText('detail')).toBeInTheDocument();

    rerender(await RequestCard({ request: mockRequest }));
    expect(screen.queryByText('detail')).not.toBeInTheDocument();

    rerender(await RequestCard({ request: mockInProcessRequest }));
    expect(screen.queryByText('detail')).not.toBeInTheDocument();
  });

  it('display error details when accordion is expanded', async () => {
    render(await RequestCard({ request: mockErrorRequest }));

    const accordionTrigger = screen.getByText('detail');
    fireEvent.click(accordionTrigger);

    expect(screen.getByText('Not found error details')).toBeInTheDocument();
  });
});
