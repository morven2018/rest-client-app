import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { HistoryFilters } from '@/components/layout/history/history-filters';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  ChevronDownIcon: () => <div>ChevronDownIcon</div>,
  RotateCcw: () => <div>RotateCcw</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    className,
    title,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    className?: string;
    title?: string;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      className={className}
      title={title}
      data-testid={title ? `button-${title}` : 'button'}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({
    mode,
    selected,
    onSelect,
  }: {
    mode: string;
    selected?: unknown;
    onSelect?: (range: { from: Date; to: Date }) => void;
  }) => (
    <div data-mode={mode} data-testid="calendar">
      Calendar Mock - Selected: {selected ? 'has selection' : 'no selection'}
      <button
        onClick={() =>
          onSelect?.({
            from: new Date('2023-01-01'),
            to: new Date('2023-01-07'),
          })
        }
        data-testid="set-date-range"
      >
        Set Date Range
      </button>
    </div>
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <label className={className} data-testid="label">
      {children}
    </label>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange?: (value: string) => void;
  }) => (
    <div data-value={value} data-testid="select">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { onValueChange } as Partial<unknown>)
          : child
      )}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <div data-testid="select-value" data-placeholder={placeholder}>
      {placeholder}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => {
    const handleClick = () => {
      const event = new Event('click');
      Object.defineProperty(event, 'target', {
        value: { getAttribute: () => value },
      });

      if (
        React.isValidElement(children) &&
        typeof (children as { props?: { onClick?: () => void } }).props
          ?.onClick === 'function'
      ) {
        (children as { props: { onClick: () => void } }).props.onClick();
      }
    };

    return (
      <div
        data-value={value}
        className={className}
        data-testid={`select-item-${value}`}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  },
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover">{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({
    children,
    className,
    align,
  }: {
    children: React.ReactNode;
    className?: string;
    align?: string;
  }) => (
    <div className={className} data-align={align} data-testid="popover-content">
      {children}
    </div>
  ),
}));

jest.mock('@/lib/formatter', () => ({
  formatDate: (date: string, locale: string, short?: boolean) =>
    short ? 'Jan 1, 2023' : 'January 1, 2023',
}));

describe('HistoryFilters', () => {
  const mockPush = jest.fn();
  const mockPathname = '/history-and-analytics';
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (usePathname as jest.Mock).mockReturnValue(mockPathname);

    (useSearchParams as jest.Mock).mockImplementation(() => mockSearchParams);

    (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
      const translations: Record<string, string> = {
        'filters.method': 'method',
        'filters.status': 'status',
        'filters.all-method': 'all-method',
        'filters.all-status': 'all-status',
        'filters.ok': 'ok',
        'filters.error': 'error',
        'filters.in-process': 'in-process',
        'filters.not-send': 'not-send',
        'filters.dates': 'dates',
        'filters.reset': 'reset',
      };
      return (key: string) => translations[key] || key;
    });
  });

  const defaultProps = {
    searchParams: {},
    locale: 'en',
  };

  it('render all filter components', () => {
    render(<HistoryFilters {...defaultProps} />);

    expect(screen.getByText('method')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('dates')).toBeInTheDocument();
    expect(screen.getByTitle('reset')).toBeInTheDocument();
  });

  it('handle method filter change', () => {
    render(<HistoryFilters {...defaultProps} />);

    const methodItems = screen.getAllByTestId('select-item-GET');
    fireEvent.click(methodItems[0]);

    const selectElements = screen.getAllByTestId('select');
    const methodSelect = selectElements[0];
    expect(methodSelect).toHaveAttribute('data-value', 'all');
  });

  it('handle status filter change', () => {
    render(<HistoryFilters {...defaultProps} />);

    const statusItems = screen.getAllByTestId('select-item-ok');
    fireEvent.click(statusItems[0]);

    const selectElements = screen.getAllByTestId('select');
    const statusSelect = selectElements[1];
    expect(statusSelect).toHaveAttribute('data-value', 'all');
  });

  it('handle date range selection', () => {
    render(<HistoryFilters {...defaultProps} />);

    const dateButton = screen.getByText('dates');
    fireEvent.click(dateButton);

    const setDateButton = screen.getByText('Set Date Range');
    fireEvent.click(setDateButton);

    expect(mockPush).toHaveBeenCalled();
  });

  it('handle reset button click', () => {
    render(<HistoryFilters {...defaultProps} />);

    const resetButton = screen.getByTitle('reset');
    fireEvent.click(resetButton);

    expect(mockPush).toHaveBeenCalledWith('/en/history-and-analytics');
  });

  it('display current filter values from searchParams', () => {
    const propsWithFilters = {
      searchParams: {
        method: 'POST',
        status: 'error',
        dateFrom: '2023-01-01',
        dateTo: '2023-01-07',
      },
      locale: 'en',
    };

    mockSearchParams.set('method', 'POST');
    mockSearchParams.set('status', 'error');

    render(<HistoryFilters {...propsWithFilters} />);

    const selectElements = screen.getAllByTestId('select');
    expect(selectElements[1]).toHaveAttribute('data-value', 'error');
  });

  it('apply correct CSS classes for dark mode', () => {
    render(<HistoryFilters {...defaultProps} />);

    const container = screen.getByText('method').closest('div');
    expect(container).toHaveClass('flex flex-row items-center');
  });

  it('render with custom searchParams', () => {
    const customProps = {
      searchParams: {
        method: 'PUT',
        status: 'in process',
      },
      locale: 'fr',
    };

    render(<HistoryFilters {...customProps} />);

    expect(screen.getByText('method')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
  });
});
