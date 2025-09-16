import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestData } from '@/hooks/use-request';

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h4 className="text-lg font-semibold">{request.method}</h4>
        <Badge variant={getStatusVariant(request.status)}>
          {(request.status === 'ok' || request.status === 'error') &&
            request.code}
          {request.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-base mb-4">
          {request.url_with_vars}
        </CardTitle>

        <ul className="space-y-2">
          <li key="Duration" className="flex justify-between">
            <div className="font-medium">{t('duration')}</div>
            <div>
              {request.status === 'ok' || request.status === 'error'
                ? `${request.Duration} ${t('ms')}`
                : '-'}
            </div>
          </li>
          <li key="Date" className="flex justify-between">
            <div className="font-medium">{t('date')}</div>
            <div>{request.Date}</div>
          </li>
          <li key="Time" className="flex justify-between">
            <div className="font-medium">{t('time')}</div>
            <div>{request.Time}</div>
          </li>
          <li key="Request" className="flex justify-between">
            <div className="font-medium">{t('request')}</div>
            <div>{request.Request_weight}</div>
          </li>
          <li key="Response" className="flex justify-between">
            <div className="font-medium">{t('response')}</div>
            <div>
              {request.status === 'ok' || request.status === 'error'
                ? request.Response_weight
                : '-'}
            </div>
          </li>
        </ul>

        {request.status === 'error' && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="error-details">
              <AccordionTrigger className="text-sm font-medium">
                {t('detail')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted p-3 rounded-md">
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
