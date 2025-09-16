import { act, renderHook } from '@testing-library/react';
import { useEnvVariables } from '@/hooks/use-env-variables';

const LS_URL = 'http://localhost:3000';
const URL_API = 'https://api.example.com';

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useEnvVariables', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
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
      development: { API_URL: LS_URL, API_KEY: 'dev-key' },
      production: { API_URL: URL_API },
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.variables).toEqual(storedData);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('variables');
  });

  it('handle localStorage parsing error', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useEnvVariables());

    expect(result.current.variables).toEqual({});
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading variables from localStorage:',
      expect.objectContaining({
        message: expect.stringContaining('JSON'),
      })
    );
    consoleErrorSpy.mockRestore();
  });

  describe('environment', () => {
    it('add new environment', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useEnvVariables());

      act(() => {
        result.current.addEnv('development', {
          API_URL: LS_URL,
        });
      });

      expect(result.current.variables).toEqual({
        development: { API_URL: LS_URL },
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'variables',
        JSON.stringify({ development: { API_URL: LS_URL } })
      );
    });

    it('remove environment', () => {
      const initialData = {
        development: { API_URL: LS_URL },
        production: { API_URL: URL_API },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

      const { result } = renderHook(() => useEnvVariables());

      act(() => {
        result.current.removeEnv('development');
      });

      expect(result.current.variables).toEqual({
        production: { API_URL: URL_API },
      });
    });

    it('rename environment', () => {
      const initialData = {
        dev: { API_URL: LS_URL },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

      const { result } = renderHook(() => useEnvVariables());

      act(() => {
        result.current.renameEnv('dev', 'development');
      });

      expect(result.current.variables).toEqual({
        development: { API_URL: LS_URL },
      });
    });

    it('clear environment variables', () => {
      const initialData = {
        development: { API_URL: LS_URL, API_KEY: 'key' },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

      const { result } = renderHook(() => useEnvVariables());

      act(() => {
        result.current.clearEnv('development');
      });

      expect(result.current.variables).toEqual({
        development: {},
      });
    });
  });

  describe('variable', () => {
    it('set variable in environment', () => {
      const initialData = {
        development: { API_URL: LS_URL },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

      const { result } = renderHook(() => useEnvVariables());

      act(() => {
        result.current.setVariable('development', 'API_KEY', 'new-key');
      });

      expect(result.current.variables).toEqual({
        development: { API_URL: LS_URL, API_KEY: 'new-key' },
      });
    });

    it('remove variable from environment', () => {
      const initialData = {
        development: { API_URL: LS_URL, API_KEY: 'key' },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));

      const { result } = renderHook(() => useEnvVariables());

      act(() => {
        result.current.removeVariable('development', 'API_KEY');
      });

      expect(result.current.variables).toEqual({
        development: { API_URL: LS_URL },
      });
    });

    it('not remove variable from non-existent environment', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useEnvVariables());

      const initialVariables = { ...result.current.variables };

      act(() => {
        result.current.removeVariable('non-existent', 'API_KEY');
      });

      expect(result.current.variables).toEqual(initialVariables);
    });
  });

  describe('query methods', () => {
    const initialData = {
      development: { API_URL: LS_URL, API_KEY: 'dev-key' },
      production: { API_URL: URL_API },
    };

    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialData));
    });

    it('get environment names', () => {
      const { result } = renderHook(() => useEnvVariables());

      expect(result.current.getEnv()).toEqual(['development', 'production']);
    });

    it('get environment variables', () => {
      const { result } = renderHook(() => useEnvVariables());

      expect(result.current.getEnvVariables('development')).toEqual({
        API_URL: LS_URL,
        API_KEY: 'dev-key',
      });
    });

    it('return empty object for non-existent environment', () => {
      const { result } = renderHook(() => useEnvVariables());

      expect(result.current.getEnvVariables('non-existent')).toEqual({});
    });

    it('check if environment exists', () => {
      const { result } = renderHook(() => useEnvVariables());

      expect(result.current.environmentExists('development')).toBe(true);
      expect(result.current.environmentExists('non-existent')).toBe(false);
    });

    it('check if variable exists in environment', () => {
      const { result } = renderHook(() => useEnvVariables());

      expect(result.current.variableExists('development', 'API_URL')).toBe(
        true
      );
      expect(result.current.variableExists('development', 'NON_EXISTENT')).toBe(
        false
      );
      expect(result.current.variableExists('non-existent', 'API_URL')).toBe(
        false
      );
    });
  });

  it('persist changes to localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useEnvVariables());

    act(() => {
      result.current.addEnv('test', { VAR: 'value' });
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'variables',
      JSON.stringify({ test: { VAR: 'value' } })
    );
  });
});
