import { act, renderHook } from '@testing-library/react';
import { toastError } from '@/components/ui/sonner';
import { useEnvVariables } from '@/hooks/use-env-variables';

const LS_URL = 'http://localhost:3000';

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock('@/components/ui/sonner', () => ({
  toastError: jest.fn(),
}));

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useEnvVariables', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initialize with empty variables when localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.variables).toEqual({});
    expect(result.current.loading).toBe(false);
  });

  it('load variables from localStorage on mount', () => {
    const storedData = {
      API_URL: LS_URL,
      API_KEY: 'dev-key',
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.variables).toEqual(storedData);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('variables');
  });

  it('handle localStorage parsing error', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.variables).toEqual({});
    expect(toastError).toHaveBeenCalledWith(
      'Error loading variables from localStorage:',
      {
        additionalMessage:
          'Unexpected token \'i\', "invalid-json" is not valid JSON',
        duration: 3000,
      }
    );
  });

  it('set variable', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useEnvVariables());

    act(() => {
      result.current.setVariable('API_URL', LS_URL);
    });

    expect(result.current.variables).toEqual({
      API_URL: LS_URL,
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'variables',
      JSON.stringify({ API_URL: LS_URL })
    );
  });

  it('remove variable', () => {
    const initialData = {
      API_URL: LS_URL,
      API_KEY: 'dev-key',
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

    const { result } = renderHook(() => useEnvVariables());

    act(() => {
      result.current.removeVariable('API_KEY');
    });

    expect(result.current.variables).toEqual({
      API_URL: LS_URL,
    });
  });

  it('clear all variables', () => {
    const initialData = {
      API_URL: LS_URL,
      API_KEY: 'dev-key',
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

    const { result } = renderHook(() => useEnvVariables());

    act(() => {
      result.current.clearVariables();
    });

    expect(result.current.variables).toEqual({});
  });

  it('check if variable exists', () => {
    const initialData = {
      API_URL: LS_URL,
      API_KEY: 'dev-key',
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.variableExists('API_URL')).toBe(true);
    expect(result.current.variableExists('NON_EXISTENT')).toBe(false);
  });

  it('get variable value', () => {
    const initialData = {
      API_URL: LS_URL,
      API_KEY: 'dev-key',
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.variableValue('API_URL')).toBe(LS_URL);
    expect(result.current.variableValue('NON_EXISTENT')).toBe('');
  });

  it('get all environment variables', () => {
    const initialData = {
      API_URL: LS_URL,
      API_KEY: 'dev-key',
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.getEnvVariables()).toEqual(initialData);
  });

  it('persist changes to localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useEnvVariables());

    act(() => {
      result.current.setVariable('TEST_VAR', 'test-value');
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'variables',
      JSON.stringify({ TEST_VAR: 'test-value' })
    );
  });
});
