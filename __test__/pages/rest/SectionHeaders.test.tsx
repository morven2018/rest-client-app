import React from 'react';
import SectionHeaders from '@/components/rest/SectionHeaders';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { Header } from '@/app/[locale]/restful/[[...rest]]/content';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-123'),
  },
});

describe('SectionHeaders', () => {
  const mockOnHeadersChange = jest.fn();
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      headersTitle: 'Headers',
      noHeadersText: 'No headers added',
      buttonAddHeader: 'Add Header',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  it('render with empty headers', () => {
    render(
      <SectionHeaders headers={[]} onHeadersChange={mockOnHeadersChange} />
    );

    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('No headers added')).toBeInTheDocument();
    expect(screen.getByText('Add Header')).toBeInTheDocument();
  });

  it('render with existing headers', () => {
    const headers: Header[] = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token' },
    ];

    render(
      <SectionHeaders headers={headers} onHeadersChange={mockOnHeadersChange} />
    );

    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bearer token')).toBeInTheDocument();
  });

  it('add new header on Add button click', async () => {
    const user = userEvent.setup();
    render(
      <SectionHeaders headers={[]} onHeadersChange={mockOnHeadersChange} />
    );

    const addButton = screen.getByRole('button', { name: 'Add Header' });
    await user.click(addButton);

    expect(mockOnHeadersChange).toHaveBeenCalledWith([{ key: '', value: '' }]);
  });

  it('update header key if input is changed', async () => {
    const user = userEvent.setup();
    const headers: Header[] = [{ key: '', value: '' }];

    render(
      <SectionHeaders headers={headers} onHeadersChange={mockOnHeadersChange} />
    );

    const keyInput = screen.getByPlaceholderText('placeholderKey');
    await user.type(keyInput, 'Content-Type');

    expect(mockOnHeadersChange).toHaveBeenCalledWith([
      { key: 'Content-Type', value: '' },
    ]);
  });

  it('update header value if input change', async () => {
    const user = userEvent.setup();
    const headers: Header[] = [{ key: 'Content-Type', value: '' }];

    render(
      <SectionHeaders headers={headers} onHeadersChange={mockOnHeadersChange} />
    );

    const valueInput = screen.getByPlaceholderText('placeholderValue');
    await user.type(valueInput, 'application/json');

    expect(mockOnHeadersChange).toHaveBeenCalledWith([
      { key: 'Content-Type', value: 'application/json' },
    ]);
  });

  it('generate unique IDs for headers', () => {
    const headers: Header[] = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token' },
    ];

    render(
      <SectionHeaders headers={headers} onHeadersChange={mockOnHeadersChange} />
    );

    expect(crypto.randomUUID).toHaveBeenCalledTimes(2);
  });

  it('maintain header order on updating', async () => {
    const user = userEvent.setup();
    const headers: Header[] = [
      { key: 'Header1', value: 'Value1' },
      { key: 'Header2', value: 'Value2' },
    ];

    render(
      <SectionHeaders headers={headers} onHeadersChange={mockOnHeadersChange} />
    );

    const keyInputs = screen.getAllByPlaceholderText('placeholderKey');
    await user.type(keyInputs[0], '-updated');

    expect(mockOnHeadersChange).toHaveBeenCalledWith([
      { key: 'Header1-updated', value: 'Value1' },
      { key: 'Header2', value: 'Value2' },
    ]);
  });

  it('should handle multiple header operations correctly', async () => {
    const user = userEvent.setup();
    const headers: Header[] = [];

    const { rerender } = render(
      <SectionHeaders headers={headers} onHeadersChange={mockOnHeadersChange} />
    );

    const addButton = screen.getByRole('button', { name: 'Add Header' });
    await user.click(addButton);

    const updatedHeaders1: Header[] = [
      { key: 'Content-Type', value: 'application/json' },
    ];
    rerender(
      <SectionHeaders
        headers={updatedHeaders1}
        onHeadersChange={mockOnHeadersChange}
      />
    );

    const keyInput = screen.getByDisplayValue('Content-Type');
    await user.clear(keyInput);
    await user.type(keyInput, 'Authorization');

    expect(mockOnHeadersChange).toHaveBeenCalledWith([
      { key: 'Authorization', value: 'application/json' },
    ]);
  });
});
