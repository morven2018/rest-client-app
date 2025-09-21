import { ClipboardList, Copy, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { ResponseData } from '@/app/[locale]/restful/[[...rest]]/content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
    if (status >= 200 && status < 300) return 'bg-teal-600';
    if (status >= 300 && status < 400) return 'bg-yellow-500';
    if (status >= 400) return 'bg-red-700';
    return 'bg-gray-500';
  };

  const handleCopy = () => {
    if (!responseData?.body) return;
    navigator.clipboard.writeText(responseData.body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const handleSaveRequestBody = () => {
    if (
      typeof responseData?.body === 'string' &&
      responseData.body.trim() !== ''
    ) {
      const link: HTMLAnchorElement = document.createElement('a');
      const file: Blob = new Blob([responseData.body], {
        type: 'application/json',
      });
      link.href = URL.createObjectURL(file);
      link.download = 'responseBody.json';
      link.click();
      URL.revokeObjectURL(link.href);
    }
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
            <h3 className="font-sans font-semibold text-xl leading-7 tracking-normal align-middle">
              {t('responseTitle')}
            </h3>
            <div className="w-full">
              <Badge className={getStatusColor(responseData.status)}>
                {responseData.status} {responseData.statusText}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <div className="flex justify-end gap-2">
              <Button
                className="p-2 bg-white hover:bg-gray-300 text-black dark:bg-neutral-600 hover:dark:bg-neutral-500 dark:text-white cursor-pointer"
                onClick={handleSaveRequestBody}
              >
                <Save />
              </Button>
              <Button
                className="p-2 bg-white hover:bg-gray-300 text-black dark:bg-neutral-600 hover:dark:bg-neutral-500 dark:text-white cursor-pointer"
                onClick={handleCopy}
              >
                {copied ? <Copy /> : <ClipboardList />}
              </Button>
            </div>
            <pre
              className={`${getStatusColor(responseData.status)} w-full max-w-full min-h-75 rounded-[8px] mt-4 p-3 overflow-auto whitespace-pre-wrap break-all font-mono text-white`}
            >
              {responseData.body}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
