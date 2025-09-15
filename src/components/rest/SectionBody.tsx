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
  const [contentType, setContentType] = useState<'json' | 'text'>('json');
  const [copied, setCopied] = useState(false);
  const t = useTranslations('RestClient');

  const handleCopy = () => {
    if (!body) return;
    navigator.clipboard.writeText(body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const handleTypeChange = (value: 'json' | 'text') => {
    setContentType(value);
  };

  const getPlaceholder = () => {
    if (contentType === 'json') {
      return '{\n  "key": "value",\n  "array": [1, 2, 3]\n}';
    }
    return 'Enter text content...';
  };

  return (
    <section className="px-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            {t('bodyTitle')}
            <div
              className="flex w-full justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <Select value={contentType} onValueChange={handleTypeChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="json">
                    {t('bodyJSON')}
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="text">
                    {t('bodyText')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <div className="flex gap-2 w-full justify-end mb-4">
              <Button className="cursor-pointer">
                <Save />
              </Button>
              <Button className="cursor-pointer" onClick={handleCopy}>
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
