import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Save, ClipboardList, Copy } from 'lucide-react';
import type { ResponseData } from '@/app/[locale]/restful/[[...rest]]/page';

interface SectionResponseProps {
  readonly responseData: ResponseData | null;
  readonly isLoading: boolean;
}

export default function SectionResponse({
  responseData,
  isLoading,
}: SectionResponseProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('RestClient');

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-yellow-500';
    if (status >= 400) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const handleCopy = () => {
    if (!responseData?.body) return;
    navigator.clipboard.writeText(responseData.body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  if (isLoading) {
    return (
      <section className="px-6">
        <div className="flex items-center justify-center w-full min-h-75 rounded-[8px] mt-4 p-3">
          <span>{t('responseSendingRequest')}</span>
        </div>
      </section>
    );
  }

  if (!responseData) {
    return (
      <section className="px-6">
        <span className="flex items-center justify-center w-full min-h-75 rounded-[8px] mt-4 p-3">
          {t('responseNoYet')}
        </span>
      </section>
    );
  }

  return (
    <section className="px-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex items-center min-h-20">
            {t('responseTitle')}
            <div className="w-full">
              <Badge className={getStatusColor(responseData.status)}>
                {responseData.status} {responseData.statusText}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <div className="flex justify-end gap-2">
              <Button>
                <Save />
              </Button>
              <Button className="cursor-pointer" onClick={handleCopy}>
                {copied ? <Copy /> : <ClipboardList />}
              </Button>
            </div>
            <pre
              className={`${getStatusColor(responseData.status)} w-full min-h-75 rounded-[8px] mt-4 p-3 overflow-y-auto whitespace-pre-wrap font-mono`}
            >
              {responseData.body}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
