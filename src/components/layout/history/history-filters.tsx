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
    const fromStr = formatDate(from.toISOString(), locale, true);
    const toStr = formatDate(to.toISOString(), locale, true);
    return `${fromStr} - ${toStr}`;
  };

  return (
    <div className="p-6 bg-violet-100 dark:bg-violet-900 rounded-lg max-[580px]:px-1.5">
      <div className=" flex flex-row items-center gap-1 justify-around flex-wrap">
        <div className="flex flex-row items-center ">
          <Label className="block text-base font-medium text-foreground py-2 pr-3">
            {t('method')}
          </Label>
          <Select
            value={searchParams?.method || 'all'}
            onValueChange={(value) => handleFilterChange('method', value)}
          >
            <SelectTrigger className="w-full px-3 py-2 bg-white dark:bg-violet-950 cursor-pointer">
              <SelectValue placeholder={t('all-method')} />
            </SelectTrigger>
            <SelectContent className="px-3 py-2 bg-white dark:bg-violet-950">
              <SelectItem className="cursor-pointer" value="all">
                {t('all-method')}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="GET">
                GET
              </SelectItem>
              <SelectItem className="cursor-pointer" value="POST">
                POST
              </SelectItem>
              <SelectItem className="cursor-pointer" value="PUT">
                PUT
              </SelectItem>
              <SelectItem className="cursor-pointer" value="PATCH">
                PATCH
              </SelectItem>
              <SelectItem className="cursor-pointer" value="DELETE">
                DELETE
              </SelectItem>
              <SelectItem className="cursor-pointer" value="HEAD">
                HEAD
              </SelectItem>
              <SelectItem className="cursor-pointer" value="OPTIONS">
                OPTIONS
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center">
          <Label className="block text-base font-medium text-foreground py-2 pr-3">
            {t('status')}
          </Label>
          <Select
            value={searchParams?.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-full px-3 py-2 bg-white dark:bg-violet-950 cursor-pointer">
              <SelectValue
                placeholder={t('all-status')}
                className="px-3 py-2 bg-white"
              />
            </SelectTrigger>
            <SelectContent className="px-3 py-2 bg-white dark:bg-violet-950">
              <SelectItem className="cursor-pointer" value="all">
                {t('all-status')}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="ok">
                {t('ok')}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="error">
                {t('error')}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="in process">
                {t('in-process')}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="not send">
                {t('not-send')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex -flex-row gap-2 justify-between flex-nowrap max-[400px]:flex-wrap">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal h-9 dark:bg-violet-950 cursor-pointer"
                >
                  {dateRange?.from && dateRange?.to
                    ? formatDateRange(dateRange.from, dateRange.to)
                    : t('dates')}
                  <ChevronDownIcon className="size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 dark:bg-violet-950"
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

          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              title={t('reset')}
              className="dark:bg-violet-950 dark:hover:bg-violet-900 cursor-pointer"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
