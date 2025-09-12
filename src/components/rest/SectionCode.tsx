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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SectionCode() {
  const [generator, setGenerator] = useState('curl');

  const t = useTranslations('RestClient');

  const generators = [
    'curl',
    'JavaScript (Fetch api)',
    'JavaScript (XHR)',
    'NodeJS',
    'Python',
    'Java',
    'C#',
    'Go',
  ];

  const handleGeneratorChange = (value: string) => {
    setGenerator(value);
  };

  return (
    <section className="px-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            {t('codeTitle')}
            <div className="flex flex-col gap-2 w-full sm:justify-end sm:flex-row">
              <Select value={generator} onValueChange={handleGeneratorChange}>
                <SelectTrigger
                  className="w-[200px] cursor-pointer"
                  aria-label="Code generators Selector"
                >
                  <SelectValue placeholder="Code generator" />
                </SelectTrigger>
                <SelectContent>
                  {generators.map((generator) => (
                    <SelectItem
                      key={generator}
                      value={generator}
                      className="cursor-pointer"
                    >
                      {generator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-[200px] cursor-pointer">
                {t('codeButton')}
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <Button className="block mb-4 ml-auto cursor-pointer">
              <ClipboardList />
            </Button>
            <Textarea
              placeholder="curl https://jsonplaceholder.typicode.com/posts/1"
              className="min-h-25"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
