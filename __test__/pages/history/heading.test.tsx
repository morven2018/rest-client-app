import HistoryHeading from '@/components/layout/history/history-heading';
import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';

// Mock next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}));

// Mock next/link
jest.mock('@/i18n/navigation', () => ({
  Link: jest.fn(({ children, href, title, className }) => (
    <a href={href} title={title} className={className} data-testid="link">
      {children}
    </a>
  )),
}));

describe('HistoryHeading', () => {
  const mockT = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getTranslations as jest.Mock).mockResolvedValue(mockT);
  });

  it('renders title and link with correct translations', async () => {
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        title: 'Request History',
        'to-rest': 'Go to REST Client',
      };
      return translations[key] || key;
    });

    render(await HistoryHeading());

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Request History'
    );
    expect(screen.getByTestId('link')).toHaveTextContent('Go to REST Client');
    expect(screen.getByTestId('link')).toHaveAttribute(
      'title',
      'Go to REST Client'
    );
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/restful');
  });

  it('applies correct CSS classes', async () => {
    mockT.mockImplementation((key: string) => {
      if (key === 'title') return 'History';
      if (key === 'to-rest') return 'To REST';
      return key;
    });

    render(await HistoryHeading());

    const heading = screen.getByRole('heading', { level: 2 });
    const link = screen.getByTestId('link');

    expect(heading).toHaveClass('text-xl font-semibold');
    expect(link).toHaveClass('bg-violet-200');
    expect(link).toHaveClass('hover:bg-violet-300');
    expect(link).toHaveClass('dark:bg-violet-900');
    expect(link).toHaveClass('dark:hover:bg-violet-800');
    expect(link).toHaveClass('px-4');
    expect(link).toHaveClass('py-2');
    expect(link).toHaveClass('rounded-lg');
  });

  it('has correct layout structure', async () => {
    mockT.mockImplementation((key: string) => {
      if (key === 'title') return 'History';
      if (key === 'to-rest') return 'To REST';
      return key;
    });

    const { container } = render(await HistoryHeading());

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('flex-row');
    expect(wrapper).toHaveClass('py-5');
    expect(wrapper).toHaveClass('px-6');
    expect(wrapper).toHaveClass('justify-between');
    expect(wrapper).toHaveClass('items-center');
  });

  it('calls getTranslations with correct namespace', async () => {
    mockT.mockImplementation((key: string) => {
      if (key === 'title') return 'History';
      if (key === 'to-rest') return 'To REST';
      return key;
    });

    render(await HistoryHeading());

    expect(getTranslations).toHaveBeenCalledWith('history');
  });

  it('uses translations correctly for both title and link', async () => {
    mockT.mockImplementation((key: string) => {
      if (key === 'title') return 'История запросов';
      if (key === 'to-rest') return 'Перейти к REST';
      return key;
    });

    render(await HistoryHeading());

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'История запросов'
    );
    expect(screen.getByTestId('link')).toHaveTextContent('Перейти к REST');
    expect(screen.getByTestId('link')).toHaveAttribute(
      'title',
      'Перейти к REST'
    );
  });
});
