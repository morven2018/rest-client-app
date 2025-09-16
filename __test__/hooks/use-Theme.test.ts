import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { ThemeContext } from '@/context/themeContext';
import type { ThemeContextType } from '@/context/themeContext';
import { useTheme } from '@/hooks/useTheme';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('useTheme', () => {
  const mockThemeContext: ThemeContextType = {
    theme: 'dark',
    toggleTheme: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('return theme context when used within ThemeProvider', () => {
    (useContext as jest.Mock).mockReturnValue(mockThemeContext);
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(typeof result.current.toggleTheme).toBe('function');
    expect(useContext).toHaveBeenCalledWith(ThemeContext);
  });

  it('throw error when used outside ThemeProvider', () => {
    (useContext as jest.Mock).mockReturnValue(undefined);
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
  });

  it('handle light theme', () => {
    const lightThemeContext: ThemeContextType = {
      theme: 'light',
      toggleTheme: jest.fn(),
    };

    (useContext as jest.Mock).mockReturnValue(lightThemeContext);
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });
});
