import EnvironmentVariablesContent from '@/components/layout/variables/env-content';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { EnvTableProps } from '@/components/layout/variables/env-table';
import { useEnvVariables } from '@/hooks/use-env-variables';

jest.mock('@/hooks/use-env-variables');

const mockUseEnvVariables = useEnvVariables as jest.MockedFunction<
  typeof useEnvVariables
>;

jest.mock('@/components/layout/variables/env-buttons', () => ({
  __esModule: true,
  default: ({
    selectedCount,
    onAddVariable,
    onRemoveSelected,
  }: {
    selectedCount: number;
    onAddVariable: () => void;
    onRemoveSelected: () => void;
  }) => (
    <div data-testid="env-buttons">
      <button data-testid="add-variable" onClick={onAddVariable}>
        Add Variable
      </button>
      <button data-testid="remove-selected" onClick={onRemoveSelected}>
        Remove Selected
      </button>
      <span data-testid="selected-count">{selectedCount}</span>
    </div>
  ),
}));

jest.mock('@/components/layout/variables/env-table', () => ({
  __esModule: true,
  default: ({
    variables,
    selectedVars,
    onNameChange,
    onValueChange,
    onDeleteVariable,
    onSelectVariable,
    onDeselectVariable,
    onSelectAll,
    onDeselectAll,
    onSort,
    onFocus,
    onBlur,
  }: EnvTableProps) => (
    <div data-testid="env-table">
      <button data-testid="select-all" onClick={onSelectAll}>
        Select All
      </button>
      <button data-testid="deselect-all" onClick={onDeselectAll}>
        Deselect All
      </button>
      <button data-testid="sort-name" onClick={() => onSort('name')}>
        Sort Name
      </button>
      <button data-testid="sort-value" onClick={() => onSort('value')}>
        Sort Value
      </button>

      {variables.map((variable) => (
        <div key={variable.name} data-testid={`variable-${variable.name}`}>
          <input
            data-testid={`name-input-${variable.name}`}
            defaultValue={variable.name}
            onChange={(e) => onNameChange(variable.name, e.target.value)}
            onFocus={() => onFocus(variable.name, 'name')}
            onBlur={onBlur}
          />
          <input
            data-testid={`value-input-${variable.name}`}
            defaultValue={variable.value}
            onChange={(e) => onValueChange(variable.name, e.target.value)}
            onFocus={() => onFocus(variable.name, 'value')}
            onBlur={onBlur}
          />
          <button
            data-testid={`delete-${variable.name}`}
            onClick={() => onDeleteVariable(variable.name)}
          >
            Delete
          </button>
          <input
            type="checkbox"
            data-testid={`select-${variable.name}`}
            checked={selectedVars.has(variable.name)}
            onChange={(e) => {
              if (e.target.checked) {
                onSelectVariable(variable.name);
              } else {
                onDeselectVariable(variable.name);
              }
            }}
          />
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/layout/variables/no-variables', () => ({
  __esModule: true,
  default: ({ onAddVariable }: { onAddVariable: () => void }) => (
    <div data-testid="no-variables">
      <button data-testid="add-first-variable" onClick={onAddVariable}>
        Add First Variable
      </button>
    </div>
  ),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('EnvironmentVariablesContent', () => {
  const mockSetVariable = jest.fn();
  const mockRemoveVariable = jest.fn();
  const mockGetEnvVariables = jest.fn();
  const mockClearVariables = jest.fn();
  const mockVariableExists = jest.fn();
  const mockVariableValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseEnvVariables.mockReturnValue({
      variables: { var1: 'value1', var2: 'value2' },
      loading: false,
      getEnvVariables: mockGetEnvVariables.mockReturnValue({
        var1: 'value1',
        var2: 'value2',
      }),
      setVariable: mockSetVariable,
      removeVariable: mockRemoveVariable,
      clearVariables: mockClearVariables,
      variableExists: mockVariableExists,
      variableValue: mockVariableValue.mockImplementation((name) =>
        name === 'var1' ? 'value1' : 'value2'
      ),
    });

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'selectedVariables') return JSON.stringify(['var1']);
      if (key === 'variables')
        return JSON.stringify({ var1: 'value1', var2: 'value2' });
      return null;
    });
  });

  it('should render no variables state when there are no variables', () => {
    mockUseEnvVariables.mockReturnValueOnce({
      variables: {},
      loading: false,
      getEnvVariables: mockGetEnvVariables.mockReturnValue({}),
      setVariable: mockSetVariable,
      removeVariable: mockRemoveVariable,
      clearVariables: mockClearVariables,
      variableExists: mockVariableExists,
      variableValue: mockVariableValue,
    });
    localStorageMock.getItem.mockReturnValue(null);

    render(<EnvironmentVariablesContent />);

    expect(screen.getByTestId('no-variables')).toBeInTheDocument();
    expect(screen.getByTestId('add-first-variable')).toBeInTheDocument();
  });

  it('should render variables table when variables exist', async () => {
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('env-table')).toBeInTheDocument();
      expect(screen.getByTestId('env-buttons')).toBeInTheDocument();
    });
  });

  it('should load variables from localStorage on mount', async () => {
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('variables');
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'selectedVariables'
      );
    });
  });

  it('should handle adding a new variable', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await user.click(screen.getByTestId('add-variable'));

    expect(mockSetVariable).toHaveBeenCalled();
  });

  it('should handle removing selected variables', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('remove-selected')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('remove-selected'));

    expect(mockRemoveVariable).toHaveBeenCalled();
  });

  it('should handle variable name change', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('name-input-var1')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('name-input-var1');
    await user.clear(nameInput);
    await user.type(nameInput, 'newVarName');

    expect(mockRemoveVariable).toHaveBeenCalledWith('var1');
    expect(mockSetVariable).toHaveBeenCalledWith('n', 'value1');
  });

  it('should handle variable value change', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('value-input-var1')).toBeInTheDocument();
    });

    const valueInput = screen.getByTestId('value-input-var1');
    await user.clear(valueInput);
    await user.type(valueInput, 'newValue');

    expect(mockSetVariable).toHaveBeenCalledWith('var1', 'newValue');
  });

  it('should handle variable deletion', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-var1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('delete-var1'));

    expect(mockRemoveVariable).toHaveBeenCalledWith('var1');
  });

  it('should handle sorting', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('sort-name')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('sort-name'));
    await user.click(screen.getByTestId('sort-value'));
  });

  it('should handle selection/deselection', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('select-var1')).toBeInTheDocument();
    });

    const checkbox = screen.getByTestId('select-var1');
    await user.click(checkbox);
    await user.click(checkbox);
  });

  it('should handle select all and deselect all', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('select-all')).toBeInTheDocument();
      expect(screen.getByTestId('deselect-all')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('select-all'));
    await user.click(screen.getByTestId('deselect-all'));
  });

  it('should save selected variables to localStorage', async () => {
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const [key, value] = localStorageMock.setItem.mock.calls[0];
      expect(key).toBe('selectedVariables');
      expect(() => JSON.parse(value)).not.toThrow();
    });
  });

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup();
    render(<EnvironmentVariablesContent />);

    await waitFor(() => {
      expect(screen.getByTestId('name-input-var1')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('name-input-var1');
    await user.click(nameInput);
    await user.tab();
  });
});
