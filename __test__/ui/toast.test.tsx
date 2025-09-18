import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';

import {
  ToastOptions,
  Toaster,
  showToast,
  toast,
  toastError,
  toastNote,
  toastSuccess,
  useToast,
} from '@/components/ui/sonner';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}));

jest.mock('sonner', () => {
  const originalModule = jest.requireActual('sonner');
  return {
    ...originalModule,
    toast: {
      ...originalModule.toast,
      custom: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      note: jest.fn(),
      dismiss: jest.fn(),
    },
    Toaster: jest.fn(() => (
      <div data-testid="sonner-toaster">Mock Toaster</div>
    )),
  };
});

jest.mock('@/components/ui/badge', () => ({
  Badge: jest.fn(({ children, variant }) => (
    <div data-testid="mock-badge" data-variant={variant}>
      {children}
    </div>
  )),
}));

jest.mock('@/lib/formatter', () => ({
  dateString: jest.fn(() => 'Mocked Date String'),
}));

describe('Toaster', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });
    (useLocale as jest.Mock).mockReturnValue('en');
    jest.clearAllMocks();
  });

  it('render Sonner Toaster', () => {
    render(<Toaster />);
    expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument();
  });

  it('pass theme to Sonner Toaster', () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'dark' });
    render(<Toaster />);
    expect(useTheme).toHaveBeenCalled();
  });

  describe('useToast Hook', () => {
    it('return the toast functions', () => {
      const { result } = renderHook(() => useToast());
      expect(result.current).toHaveProperty('showToast');
      expect(result.current).toHaveProperty('toastSuccess');
      expect(result.current).toHaveProperty('toastError');
      expect(result.current).toHaveProperty('toastNote');
    });

    it('call showToast with correct locale', () => {
      (useLocale as jest.Mock).mockReturnValue('fr');
      const { result } = renderHook(() => useToast());
      result.current.showToast('Test Message');
      expect(toast.custom).toHaveBeenCalled();
      const firstCall = (toast.custom as jest.Mock).mock.calls[0];
      expect(firstCall[1]).toEqual(expect.objectContaining({ duration: 2000 }));
    });

    it('call toastSuccess with correct arguments', () => {
      const { result } = renderHook(() => useToast());
      result.current.toastSuccess('Success Message');
      expect(toast.custom).toHaveBeenCalled();
      const firstCall = (toast.custom as jest.Mock).mock.calls[0];
      expect(firstCall[1]).toEqual(expect.objectContaining({ duration: 2000 }));
    });

    it('call toastError with correct arguments', () => {
      const { result } = renderHook(() => useToast());
      result.current.toastError('Error Message');
      expect(toast.custom).toHaveBeenCalled();
      const firstCall = (toast.custom as jest.Mock).mock.calls[0];
      expect(firstCall[1]).toEqual(expect.objectContaining({ duration: 2000 }));
    });

    it('call toastNote with correct arguments', () => {
      const { result } = renderHook(() => useToast());
      result.current.toastNote('Note Message');
      expect(toast.custom).toHaveBeenCalled();
      const firstCall = (toast.custom as jest.Mock).mock.calls[0];
      expect(firstCall[1]).toEqual(expect.objectContaining({ duration: 2000 }));
    });
  });

  describe('showToast Function', () => {
    it('call toast.custom with correct arguments and default options', () => {
      showToast('Test Message');
      expect(toast.custom).toHaveBeenCalled();
      const firstCall = (toast.custom as jest.Mock).mock.calls[0];
      expect(firstCall[1]).toEqual(expect.objectContaining({ duration: 2000 }));
    });

    it('call toast.custom with correct arguments and custom options', () => {
      const action = { label: 'Click', onClick: jest.fn() };
      showToast('Test Message', {
        type: 'success',
        additionalMessage: 'Additional Info',
        action: action,
        duration: 5000,
        locale: 'fr',
      });

      expect(toast.custom).toHaveBeenCalled();
      const firstCall = (toast.custom as jest.Mock).mock.calls[0];
      expect(firstCall[1]).toEqual(expect.objectContaining({ duration: 5000 }));

      const customToastFunction = (toast.custom as jest.Mock).mock.calls[0][0];

      const t = { id: 'test-toast' };
      const customToastElement = customToastFunction(t);

      render(customToastElement);

      expect(screen.getByText('Test Message')).toBeInTheDocument();
      expect(screen.getByTestId('mock-badge')).toBeInTheDocument();
      expect(screen.getByTestId('mock-badge')).toHaveTextContent(
        'Additional Info'
      );
      expect(screen.getByTestId('mock-badge')).toHaveAttribute(
        'data-variant',
        'ok'
      );
      expect(screen.getByText('Mocked Date String')).toBeInTheDocument();

      const actionButton = screen.getByText('Click');
      fireEvent.click(actionButton);

      expect(action.onClick).toHaveBeenCalled();
      expect(toast.dismiss).toHaveBeenCalledWith(t);
    });

    it('display toast messages with styles depending on type', () => {
      showToast('Success message', { type: 'success' });
      const toastStyle = (toast.custom as jest.Mock).mock.calls[0][0]({
        id: 'success',
      });
      render(toastStyle);
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  describe('Convenience Toast Functions', () => {
    beforeEach(() => {
      (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });
      (useLocale as jest.Mock).mockReturnValue('en');
      jest.clearAllMocks();
    });

    describe('toastSuccess', () => {
      it('call showToast with success type and message', () => {
        toastSuccess('Operation completed successfully');

        expect(toast.custom).toHaveBeenCalledTimes(1);

        const [toastRenderer, options] = (toast.custom as jest.Mock).mock
          .calls[0];
        expect(options.duration).toBe(2000);

        const t = { id: 'test-id' };
        const ToastComponent = toastRenderer(t);
        render(ToastComponent);

        expect(
          screen.getByText('Operation completed successfully')
        ).toBeInTheDocument();
      });

      it('pass additional options to showToast', () => {
        const additionalOptions: Omit<ToastOptions, 'type'> = {
          duration: 5000,
          additionalMessage: 'Additional info',
        };

        toastSuccess('Success with options', additionalOptions);

        expect(toast.custom).toHaveBeenCalledTimes(1);

        const [toastRenderer, options] = (toast.custom as jest.Mock).mock
          .calls[0];
        expect(options.duration).toBe(5000);

        const t = { id: 'test-id' };
        const ToastComponent = toastRenderer(t);
        render(ToastComponent);

        expect(screen.getByText('Success with options')).toBeInTheDocument();
        expect(screen.getByText('Additional info')).toBeInTheDocument();
      });

      it('render with correct badge variant for success', () => {
        toastSuccess('Success message', {
          additionalMessage: 'Success details',
        });

        const [toastRenderer] = (toast.custom as jest.Mock).mock.calls[0];
        const t = { id: 'test-id' };
        const ToastComponent = toastRenderer(t);

        render(ToastComponent);

        const badge = screen.getByTestId('mock-badge');
        expect(badge).toHaveAttribute('data-variant', 'ok');
        expect(badge).toHaveTextContent('Success details');
      });
    });

    describe('toastError', () => {
      it('call showToast with error type and message', () => {
        toastError('Operation failed');

        expect(toast.custom).toHaveBeenCalledTimes(1);

        const [toastRenderer] = (toast.custom as jest.Mock).mock.calls[0];

        const t = { id: 'test-id' };
        const ToastComponent = toastRenderer(t);
        render(ToastComponent);

        expect(screen.getByText('Operation failed')).toBeInTheDocument();
      });

      it('render with correct badge variant for error', () => {
        toastError('Error message', { additionalMessage: 'Error details' });

        const [toastRenderer] = (toast.custom as jest.Mock).mock.calls[0];
        const t = { id: 'test-id' };
        const ToastComponent = toastRenderer(t);

        render(ToastComponent);

        const badge = screen.getByTestId('mock-badge');
        expect(badge).toHaveAttribute('data-variant', 'error');
        expect(badge).toHaveTextContent('Error details');
      });
    });

    describe('toastNote', () => {
      it('call showToast with note type and message', () => {
        toastNote('Just a note');

        expect(toast.custom).toHaveBeenCalledTimes(1);

        const [toastRenderer] = (toast.custom as jest.Mock).mock.calls[0];

        const t = { id: 'test-id' };
        const ToastComponent = toastRenderer(t);
        render(ToastComponent);

        expect(screen.getByText('Just a note')).toBeInTheDocument();
      });

      it('pass additional options to showToast', () => {
        toastNote('Important note', {
          duration: 4000,
          additionalMessage: 'Please read this',
        });

        expect(toast.custom).toHaveBeenCalledTimes(1);

        const [toastRenderer, options] = (toast.custom as jest.Mock).mock
          .calls[0];
        expect(options.duration).toBe(4000);

        const t = { id: 'test-id' };
        const ToastComponent = toastRenderer(t);
        render(ToastComponent);

        expect(screen.getByText('Important note')).toBeInTheDocument();
        expect(screen.getByText('Please read this')).toBeInTheDocument();
      });
    });

    it('call showToast with correct type for each convenience function', () => {
      toastSuccess('success message');
      let [toastRenderer] = (toast.custom as jest.Mock).mock.calls[0];
      let t = { id: 'test-1' };
      let ToastComponent = toastRenderer(t);
      let { unmount } = render(ToastComponent);
      expect(screen.getByText('success message')).toBeInTheDocument();
      unmount();

      toastError('error message');
      [toastRenderer] = (toast.custom as jest.Mock).mock.calls[1];
      t = { id: 'test-2' };
      ToastComponent = toastRenderer(t);
      unmount = render(ToastComponent).unmount;
      expect(screen.getByText('error message')).toBeInTheDocument();
      unmount();

      toastNote('note message');
      [toastRenderer] = (toast.custom as jest.Mock).mock.calls[2];
      t = { id: 'test-3' };
      ToastComponent = toastRenderer(t);
      render(ToastComponent);
      expect(screen.getByText('note message')).toBeInTheDocument();
    });
  });

  function renderHook<T>(callback: () => T): { result: { current: T } } {
    let result: T | null = null;

    const TestComponent: React.FC = () => {
      result = callback();
      return null;
    };

    render(<TestComponent />);

    return { result: { current: result as T } };
  }
});
