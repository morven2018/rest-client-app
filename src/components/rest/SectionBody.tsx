import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, ClipboardList, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SectionBodyProps {
  readonly body: string;
  readonly onBodyChange: (body: string) => void;
}

export default function SectionBody({ body, onBodyChange }: SectionBodyProps) {
  const [contentType, setContentType] = useState<'json' | 'txt'>('json');
  const [copied, setCopied] = useState(false);
  const t = useTranslations('RestClient');

  const handleCopy = () => {
    if (!body) return;
    navigator.clipboard.writeText(body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const handleTypeChange = (value: 'json' | 'txt') => {
    setContentType(value);
  };

  const getPlaceholder = () => {
    if (contentType === 'json') {
      return '{\n  "key": "value",\n  "array": [1, 2, 3]\n}';
    }
    return 'Enter text content...';
  };

  const handleSaveBody = () => {
    if (typeof body === 'string' && body.trim() !== '') {
      const mimeType =
        contentType === 'json' ? 'application/json' : 'text/plain';
      const link: HTMLAnchorElement = document.createElement('a');
      const file: Blob = new Blob([body], {
        type: mimeType,
      });
      link.href = URL.createObjectURL(file);
      link.download = `bodyData.${contentType}`;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <section className="px-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h3 className="font-sans font-semibold text-xl leading-7 tracking-normal align-middle">
              {t('bodyTitle')}
            </h3>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <div className="flex w-full justify-end mb-4">
              <Select value={contentType} onValueChange={handleTypeChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="json">
                    {t('bodyJSON')}
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="txt">
                    {t('bodyText')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full justify-end mb-4">
              <Button
                className="p-2 bg-white hover:bg-gray-300 text-black dark:bg-neutral-600 hover:dark:bg-neutral-500 dark:text-white cursor-pointer"
                onClick={handleSaveBody}
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
            <Textarea
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
              placeholder={getPlaceholder()}
              className="min-h-40"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
