'use client';
import { ChevronDownIcon, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/formatter';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface RequestFilters {
  method?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface HistoryFiltersProps {
  searchParams?: RequestFilters;
  locale: string;
}

export function HistoryFilters({
  searchParams,
  locale,
}: Readonly<HistoryFiltersProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const t = useTranslations('filters');

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = searchParams?.dateFrom
      ? new Date(searchParams.dateFrom)
      : undefined;
    const to = searchParams?.dateTo ? new Date(searchParams.dateTo) : undefined;
    return from && to ? { from, to } : undefined;
  });

  const handleFilterChange = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(currentSearchParams.toString());

      if (value && value !== 'all') {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, currentSearchParams]
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);

      const params = new URLSearchParams(currentSearchParams.toString());

      if (range?.from) {
        params.set('dateFrom', range.from.toISOString().split('T')[0]);
      } else {
        params.delete('dateFrom');
      }

      if (range?.to) {
        params.set('dateTo', range.to.toISOString().split('T')[0]);
      } else {
        params.delete('dateTo');
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, currentSearchParams]
  );

  const handleReset = useCallback(() => {
    setDateRange(undefined);
    router.push(`/${locale}/history-and-analytics`);
  }, [router, locale]);

  const formatDateRange = (from: Date, to: Date): string => {
    const fromStr = formatDate(from.toISOString(), locale);
    const toStr = formatDate(to.toISOString(), locale);
    return `${fromStr} - ${toStr}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label className="block text-sm font-medium mb-2 text-foreground">
            {t('method')}
          </Label>
          <Select
            value={searchParams?.method || 'all'}
            onValueChange={(value) => handleFilterChange('method', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('all-method')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all-method')}</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="HEAD">HEAD</SelectItem>
              <SelectItem value="OPTIONS">OPTIONS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-sm font-medium mb-2 text-foreground">
            {t('status')}
          </Label>
          <Select
            value={searchParams?.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('all-status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all-status')}</SelectItem>
              <SelectItem value="ok">{t('ok')}</SelectItem>
              <SelectItem value="error">{t('error')}</SelectItem>
              <SelectItem value="in process">{t('in-process')}</SelectItem>
              <SelectItem value="not send">{t('not-send')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal h-9"
              >
                {dateRange?.from && dateRange?.to
                  ? formatDateRange(dateRange.from, dateRange.to)
                  : t('dates')}
                <ChevronDownIcon className="size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleReset} variant="outline" title={t('reset')}>
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
