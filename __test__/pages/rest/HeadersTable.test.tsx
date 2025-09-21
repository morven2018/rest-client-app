import HeadersTable from '@/components/rest/HeadersTable';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  ),
  TableHead: ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({
    value,
    onChange,
    placeholder,
    className,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    className: string;
  }) => (
    <input
      data-testid="input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    className,
    onClick,
    children,
  }: {
    className: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button data-testid="button" className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Trash2: () => <svg data-testid="trash-icon" />,
}));

describe('HeadersTable', () => {
  const mockOnRemove = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockT = jest.fn((key) => {
    const translations: Record<string, string> = {
      headerKey: 'Key',
      headerValue: 'Value',
      placeholderKey: 'Enter key',
      placeholderValue: 'Enter value',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    jest.clearAllMocks();
  });

  const mockHeaders = [
    { id: '1', key: 'Content-Type', value: 'application/json' },
    { id: '2', key: 'Authorization', value: 'Bearer token' },
  ];

  it('render table headers correctly', () => {
    render(
      <HeadersTable
        headers={mockHeaders}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('render all provided headers', () => {
    render(
      <HeadersTable
        headers={mockHeaders}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    );

    const inputs = screen.getAllByTestId('input');
    expect(inputs).toHaveLength(4);

    expect(inputs[0]).toHaveValue('Content-Type');
    expect(inputs[1]).toHaveValue('application/json');
    expect(inputs[2]).toHaveValue('Authorization');
    expect(inputs[3]).toHaveValue('Bearer token');
  });

  it('call onUpdate when key input is changed', () => {
    render(
      <HeadersTable
        headers={mockHeaders}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    );

    const keyInputs = screen.getAllByTestId('input');
    fireEvent.change(keyInputs[0], { target: { value: 'X-Custom-Header' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('1', 'key', 'X-Custom-Header');
  });

  it('call onUpdate when value input is changed', () => {
    render(
      <HeadersTable
        headers={mockHeaders}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    );

    const valueInputs = screen.getAllByTestId('input');
    fireEvent.change(valueInputs[1], { target: { value: 'application/xml' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('1', 'value', 'application/xml');
  });

  it('call onRemove when delete button is clicked', () => {
    render(
      <HeadersTable
        headers={mockHeaders}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    );

    const buttons = screen.getAllByTestId('button');
    fireEvent.click(buttons[0]);

    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('display correct placeholder text', () => {
    render(
      <HeadersTable
        headers={mockHeaders}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    );

    const inputs = screen.getAllByTestId('input');
    expect(inputs[0]).toHaveAttribute('placeholder', 'Enter key');
    expect(inputs[1]).toHaveAttribute('placeholder', 'Enter value');
  });

  it('render trash icon in delete buttons', () => {
    render(
      <HeadersTable
        headers={mockHeaders}
        onRemove={mockOnRemove}
        onUpdate={mockOnUpdate}
      />
    );

    const trashIcons = screen.getAllByTestId('trash-icon');
    expect(trashIcons).toHaveLength(2);
  });
});
