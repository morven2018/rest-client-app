import NoHistory from '@/components/layout/history/no-history';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      'history.no-history1': 'No history message 1',
      'history.no-history2': 'No history message 2',
      'history.to-rest': 'Go to REST Client',
    };
    return translations[key] || key;
  }),
}));

jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    title,
  }: {
    children: React.ReactNode;
    href: string;
    title?: string;
  }) => (
    <a href={href} title={title}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('NoHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render all text elements correct', async () => {
    render(await NoHistory());
    expect(screen.getByText('no-history1')).toBeInTheDocument();
    expect(screen.getByText('no-history2')).toBeInTheDocument();
  });

  it('apply correct CSS classes', async () => {
    const { container } = render(await NoHistory());

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('justify-center');
    expect(mainContainer).toHaveClass('items-center');
    expect(mainContainer).toHaveClass('mt-10');

    const innerContainer = screen.getByText('no-history1').parentElement;
    expect(innerContainer).toHaveClass('flex');
    expect(innerContainer).toHaveClass('flex-col');
    expect(innerContainer).toHaveClass('text-center');
    expect(innerContainer).toHaveClass('py-15');
    expect(innerContainer).toHaveClass('max-w-100');

    const textElements = screen.getAllByText(/no-history/);
    textElements.forEach((element) => {
      expect(element).toHaveClass('text-muted-foreground');
      expect(element).toHaveClass('mb-4');
      expect(element).toHaveClass('text-xl');
      expect(element).toHaveClass('max-[450px]:text-base');
      expect(element).toHaveClass('mb-12');
      expect(element).toHaveClass('font-medium');
    });
  });

  it('call getTranslations with correct namespace', async () => {
    render(await NoHistory());

    expect(getTranslations).toHaveBeenCalledWith('history');
  });

  it('render responsive text classes', async () => {
    render(await NoHistory());

    const textElements = screen.getAllByText(/no-history/);
    textElements.forEach((element) => {
      expect(element).toHaveClass('max-[450px]:text-base');
    });
  });
});
