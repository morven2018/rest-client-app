import EnvTable from '@/components/layout/variables/env-table';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

const API_URL = 'https://api.example.com';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => {
    const t = (key: string): string => {
      const translations: Record<string, string> = {
        'select-all': 'Select All',
        'sort-up': 'Sort ascending',
        'sort-down': 'Sort descending',
        variable: 'Variable',
        value: 'Value',
        select: 'Select',
        delete: 'Delete',
      };
      return translations[key] || key;
    };

    t.rich = jest.fn();
    t.markup = jest.fn();
    t.raw = jest.fn();
    t.has = jest.fn();

    return t;
  }),
}));

describe('EnvTable', () => {
  const mockVariables = [
    { name: 'API_URL', value: API_URL },
    { name: 'API_KEY', value: 'secret-key' },
  ];

  const mockSelectedVars = new Set(['API_URL']);
  const mockOnSort = jest.fn();
  const mockOnSelectAll = jest.fn();
  const mockOnDeselectAll = jest.fn();
  const mockOnSelectVariable = jest.fn();
  const mockOnDeselectVariable = jest.fn();
  const mockOnNameChange = jest.fn();
  const mockOnValueChange = jest.fn();
  const mockOnDeleteVariable = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();
  const mockSetInputRef = jest.fn();

  const defaultProps = {
    variables: mockVariables,
    selectedVars: mockSelectedVars,
    sortBy: 'name' as const,
    sortOrder: 'asc' as const,
    onSort: mockOnSort,
    onSelectAll: mockOnSelectAll,
    onDeselectAll: mockOnDeselectAll,
    onSelectVariable: mockOnSelectVariable,
    onDeselectVariable: mockOnDeselectVariable,
    onNameChange: mockOnNameChange,
    onValueChange: mockOnValueChange,
    onDeleteVariable: mockOnDeleteVariable,
    onFocus: mockOnFocus,
    onBlur: mockOnBlur,
    setInputRef: mockSetInputRef,
  };

  const renderTable = (overrides = {}) => {
    return render(<EnvTable {...{ ...defaultProps, ...overrides }} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render table with variables', () => {
    renderTable();

    expect(screen.getByText('Variable')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByDisplayValue('API_URL')).toBeInTheDocument();
    expect(screen.getByDisplayValue(API_URL)).toBeInTheDocument();
    expect(screen.getByDisplayValue('API_KEY')).toBeInTheDocument();
    expect(screen.getByDisplayValue('secret-key')).toBeInTheDocument();
  });

  it('handle select all checkbox', async () => {
    const user = userEvent.setup();
    renderTable({ selectedVars: new Set() });

    const selectAllCheckbox = screen.getByTitle('Select All');
    await user.click(selectAllCheckbox);

    expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
  });

  it('handle deselect all checkbox', async () => {
    const user = userEvent.setup();
    renderTable({ selectedVars: new Set(['API_URL', 'API_KEY']) });

    const selectAllCheckbox = screen.getByTitle('Select All');
    await user.click(selectAllCheckbox);

    expect(mockOnDeselectAll).toHaveBeenCalledTimes(1);
  });

  it('handle individual variable selection', async () => {
    const user = userEvent.setup();
    renderTable({ selectedVars: new Set() });

    const variableCheckboxes = screen.getAllByTitle('Select');
    await user.click(variableCheckboxes[0]);

    expect(mockOnSelectVariable).toHaveBeenCalledWith('API_URL');
  });

  it('handle individual variable deselection', async () => {
    const user = userEvent.setup();
    renderTable({ selectedVars: new Set(['API_URL']) });

    const variableCheckboxes = screen.getAllByTitle('Select');
    await user.click(variableCheckboxes[0]);

    expect(mockOnDeselectVariable).toHaveBeenCalledWith('API_URL');
  });

  it('handle name change', async () => {
    const user = userEvent.setup();
    renderTable();

    const nameInput = screen.getByDisplayValue('API_URL');
    await user.clear(nameInput);
    await user.type(nameInput, 'API_URL_NEW');

    expect(mockOnNameChange).toHaveBeenLastCalledWith('API_URL', 'API_URLW');
  });

  it('handle value change', async () => {
    const user = userEvent.setup();
    renderTable();

    const valueInput = screen.getByDisplayValue(API_URL);
    await user.clear(valueInput);
    await user.type(valueInput, 'https://api.example.com/v2');

    expect(mockOnValueChange).toHaveBeenLastCalledWith(
      'API_URL',
      'https://api.example.com2'
    );
  });

  it('handle variable deletion', async () => {
    const user = userEvent.setup();
    renderTable();

    const deleteButtons = screen.getAllByTitle('Delete');
    await user.click(deleteButtons[0]);

    expect(mockOnDeleteVariable).toHaveBeenCalledWith('API_URL');
  });

  it('handle sort click', async () => {
    const user = userEvent.setup();
    renderTable();

    const sortButton = screen.getByText('Variable');
    await user.click(sortButton);

    expect(mockOnSort).toHaveBeenCalledWith('name');
  });

  it('show sort indicators', () => {
    renderTable({ sortOrder: 'desc' });

    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('handle focus events', async () => {
    const user = userEvent.setup();
    renderTable();

    const nameInput = screen.getByDisplayValue('API_URL');
    await user.click(nameInput);

    expect(mockOnFocus).toHaveBeenCalledWith('API_URL', 'name');
  });
});
