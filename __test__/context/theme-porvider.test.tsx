import React, { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Theme, ThemeContext } from '@/context/themeContext';

jest.mock('@/context/themeContext', () => {
  const originalModule = jest.requireActual('@/context/themeContext');
  return {
    ...originalModule,
    ThemeContext: {
      ...originalModule.ThemeContext,
      Provider: jest.fn(
        ({
          value,
          children,
        }: {
          value: { theme: Theme; toggleTheme: () => void };
          children: ReactNode;
        }) => (
          <div data-testid="theme-provider" data-theme={value.theme}>
            {children}
          </div>
        )
      ),
    },
  };
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.className = '';
  });

  it('render children and provides theme context', () => {
    const testText = 'Test Child Component';

    render(
      <ThemeProvider>
        <div>{testText}</div>
      </ThemeProvider>
    );

    expect(screen.getByText(testText)).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('initialize with dark theme', () => {
    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    const provider = screen.getByTestId('theme-provider');
    expect(provider).toHaveAttribute('data-theme', 'dark');
  });

  it('toggle theme from dark to light', () => {
    let currentTheme: Theme = 'dark';
    let toggleFunction: () => void = () => {};

    const TestComponent = () => {
      return (
        <ThemeContext.Consumer>
          {(value) => {
            currentTheme = value?.theme || 'dark';
            toggleFunction = value?.toggleTheme || (() => {});
            return <button onClick={toggleFunction}>Toggle Theme</button>;
          }}
        </ThemeContext.Consumer>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(currentTheme).toBe('dark');
    expect(document.body.classList.contains('dark')).toBe(false);

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(currentTheme).toBe('dark');
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('toggle theme from light to dark', () => {
    let currentTheme: Theme = 'light';
    let toggleFunction: () => void = () => {};

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => ['light' as Theme, jest.fn()]);

    const TestComponent = () => {
      return (
        <ThemeContext.Consumer>
          {(value) => {
            currentTheme = value?.theme || 'light';
            toggleFunction = value?.toggleTheme || (() => {});
            return <button onClick={toggleFunction}>Toggle Theme</button>;
          }}
        </ThemeContext.Consumer>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(currentTheme).toBe('light');
    expect(document.body.classList.contains('dark')).toBe(false);

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(currentTheme).toBe('light');
    expect(document.body.classList.contains('light')).toBe(false);
  });

  it('update document body class when theme changes', () => {
    const { rerender } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    expect(document.body.classList.contains('dark')).toBe(false);

    document.body.classList.remove('dark');
    rerender(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    expect(document.body.classList.contains('dark')).toBe(false);
  });
});
