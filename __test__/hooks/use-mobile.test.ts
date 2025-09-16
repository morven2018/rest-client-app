import { act, renderHook } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

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

    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: mockAddEventListener,
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

  it('should return true for mobile screen initially', () => {
    window.innerWidth = 767;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('set up media query listener', () => {
    renderHook(() => useIsMobile());

    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('update isMobile when window resizes to mobile', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    window.innerWidth = 767;
    act(() => {
      const changeCallback = mockAddEventListener.mock.calls[0][1];
      changeCallback();
    });

    expect(result.current).toBe(true);
  });

  it('update isMobile when window resizes to desktop', () => {
    window.innerWidth = 767;
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);

    window.innerWidth = 1024;
    act(() => {
      const changeCallback = mockAddEventListener.mock.calls[0][1];
      changeCallback();
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
