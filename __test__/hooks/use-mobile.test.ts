import { act, renderHook } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

let mockChangeHandler: jest.Mock;
const mockMatchMedia = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
});

describe('useIsMobile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChangeHandler = jest.fn();

    mockMatchMedia.mockImplementation((query) => ({
      matches: query === '(max-width: 767px)' && window.innerWidth <= 767,
      media: query,
      addEventListener: jest.fn((event, handler) => {
        if (event === 'change') {
          mockChangeHandler = handler as jest.Mock;
        }
        return mockAddEventListener(event, handler);
      }),
      removeEventListener: mockRemoveEventListener,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it('return false for desktop screen initially', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('return true for mobile screen initially', () => {
    window.innerWidth = 767;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('set up media query listener', () => {
    renderHook(() => useIsMobile());

    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(mockAddEventListener.mock.calls[0][0]).toBe('change');
    expect(typeof mockAddEventListener.mock.calls[0][1]).toBe('function');
  });
  it('clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());

    const eventHandler = mockAddEventListener.mock.calls[0][1];

    unmount();

    expect(mockRemoveEventListener.mock.calls[0][0]).toBe('change');
    expect(typeof mockRemoveEventListener.mock.calls[0][1]).toBe('function');
    expect(mockRemoveEventListener.mock.calls[0][1]).toBe(eventHandler);
  });

  it('update isMobile when window resizes to mobile', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    window.innerWidth = 767;
    act(() => {
      mockChangeHandler({ matches: true });
    });

    expect(result.current).toBe(true);
  });

  it('update isMobile when window resizes to desktop', () => {
    window.innerWidth = 767;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);

    window.innerWidth = 1024;
    act(() => {
      mockChangeHandler({ matches: false });
    });

    expect(result.current).toBe(false);
  });

  it('exact breakpoint value', () => {
    window.innerWidth = 768;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('handle one pixel below breakpoint', () => {
    window.innerWidth = 767;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });
});
