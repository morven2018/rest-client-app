'use client';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps, toast } from 'sonner';
import { Badge } from './badge';
import { dateString } from '@/lib/formatter';

const SHOW_DURATION = 2000;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export interface ToastOptions {
  type?: 'success' | 'error' | 'note';
  additionalMessage?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  locale?: string;
}

export const useToast = () => {
  const locale = useLocale();

  const showToastWithLocale = (
    message: string,
    options?: Omit<ToastOptions, 'locale'>
  ) => {
    return showToast(message, { ...options, locale });
  };

  const toastSuccess = (
    message: string,
    options?: Omit<ToastOptions, 'type'>
  ) => showToastWithLocale(message, { ...options, type: 'success' });

  const toastError = (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showToastWithLocale(message, { ...options, type: 'error' });

  const toastNote = (message: string, options?: Omit<ToastOptions, 'type'>) =>
    showToastWithLocale(message, { ...options, type: 'note' });

  return {
    showToast: showToastWithLocale,
    toastSuccess,
    toastError,
    toastNote,
  };
};

export const showToast = (message: string, options?: ToastOptions) => {
  const {
    type = 'note',
    additionalMessage,
    action,
    duration,
    locale = 'en',
  } = options || {};

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          className: 'border-teal-100 shadow-inner bg-opacity-50',
          actionClass: 'bg-teal-700 hover:bg-teal-600 text-white',
        };
      case 'error':
        return {
          className: 'border-red-300 text-red-900 shadow-inner bg-opacity-50',
          actionClass: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'note':
      default:
        return {
          className: 'border-blue-200 text-blue-900 shadow-inner bg-opacity-50',
          actionClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
    }
  };

  const styles = getToastStyles();

  return toast.custom(
    (t) => (
      <div
        className={`p-5 rounded-lg border-2 ${styles.className} shadow-lg min-w-2xs max-w-lg flex flex-row gap-6 items-center m-0`}
      >
        <div className="flex flex-col gap-1">
          <div className="font-medium text-sm">{message}</div>

          {additionalMessage && (
            <div className="text-sm text-muted-foreground">
              <Badge variant={type === 'error' ? 'error' : 'ok'}>
                {additionalMessage}
              </Badge>
            </div>
          )}
          <div className="text-sm text-muted-foreground m-0">
            {dateString(new Date(), locale)}
          </div>
        </div>

        {action && (
          <button
            onClick={() => {
              action.onClick();
              toast.dismiss(t);
            }}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${styles.actionClass} min-w-[100px]`}
          >
            {action.label}
          </button>
        )}
      </div>
    ),
    {
      duration: duration || SHOW_DURATION,
    }
  );
};

export const toastSuccess = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
) => showToast(message, { ...options, type: 'success' });

export const toastError = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
) => showToast(message, { ...options, type: 'error' });

export const toastNote = (
  message: string,
  options?: Omit<ToastOptions, 'type'>
) => showToast(message, { ...options, type: 'note' });

export { Toaster, toast };
