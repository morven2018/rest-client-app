import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RequestData } from '@/hooks/use-request';
import { Link } from '@/i18n/navigation';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface RequestCardProps {
  request: RequestData;
}

export async function RequestCard({ request }: Readonly<RequestCardProps>) {
  const t = await getTranslations('request-card');
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ok':
        return 'ok';
      case 'error':
        return 'error';
      case 'in process':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <h4 className="text-lg font-semibold">{request.method}</h4>
        <Badge
          variant={getStatusVariant(request.status)}
          className="flex flex-row gap-1"
        >
          <div>
            {(request.status === 'ok' || request.status === 'error') &&
              request.code}
          </div>
          <div>{request.status.toUpperCase()}</div>
        </Badge>
      </CardHeader>
      <CardContent>
        <h4 className="text-base font-regular mb-4 break-words break-all underline text-zinc-600 dark:text-zinc-300">
          {request.url_with_vars}
        </h4>

        <ul className="space-y-2">
          <li key="Duration" className="flex justify-between pr-8">
            <div className="font-medium">{t('duration')}</div>
            <div className="text-zinc-600 dark:text-zinc-400">
              {request.status === 'ok' || request.status === 'error'
                ? `${request.Duration} ${t('ms')}`
                : '-'}
            </div>
          </li>
          <li key="Date" className="flex justify-between pr-8">
            <div className="font-medium">{t('date')}</div>
            <div className="text-zinc-600 dark:text-zinc-400">
              {request.Date}
            </div>
          </li>
          <li key="Time" className="flex justify-between pr-8">
            <div className="font-medium">{t('time')}</div>
            <div className="text-zinc-600 dark:text-zinc-400">
              {request.Time}
            </div>
          </li>
          <li key="Request" className="flex justify-between pr-8">
            <div className="font-medium">{t('request')}</div>
            <div className="text-zinc-600 dark:text-zinc-400">
              {request.Request_weight}
            </div>
          </li>
          <li key="Response" className="flex justify-between pr-8">
            <div className="font-medium">{t('response')}</div>
            <div className="text-zinc-600 dark:text-zinc-400">
              {request.status === 'ok' || request.status === 'error'
                ? request.Response_weight
                : '-'}
            </div>
          </li>
        </ul>

        <Link
          href={request.base64Url}
          className="flex w-full  text-center mt-4 inline-block text-base font-medium bg-violet-200 hover:bg-violet-300 dark:bg-violet-900 dark:hover:bg-violet-800 px-4 py-2 rounded-lg"
        >
          {t('view-details')}
        </Link>

        {request.status === 'error' && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="error-details">
              <AccordionTrigger className="text-sm font-medium">
                {t('detail')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-3 rounded-md">
                  <pre className="text-xs overflow-auto">
                    {request.Response}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
