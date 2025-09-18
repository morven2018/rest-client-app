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
import { ClipboardList, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { RequestData } from '@/app/[locale]/restful/[[...rest]]/page';
import generateCode from '@/lib/generator';

interface SectionCodeProps {
  readonly requestData: RequestData;
}

export default function SectionCode({ requestData }: SectionCodeProps) {
  const [generator, setGenerator] = useState('curl');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const t = useTranslations('RestClient');

  const generators = [
    { value: 'curl', label: 'curl' },
    { value: 'fetch', label: 'JavaScript (Fetch api)' },
    { value: 'xhr', label: 'JavaScript (XHR)' },
    { value: 'nodejs', label: 'NodeJS' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
  ];

  const handleGenerate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { url } = requestData;

    if (!url.trim()) {
      setGeneratedCode(t('codeNoUrl'));
      return;
    }

    const code = generateCode(requestData, generator);

    setGeneratedCode(code);
  };

  const handleGeneratorChange = (value: string) => {
    setGenerator(value);
    setGeneratedCode('');
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  return (
    <section className="px-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h3 className="font-sans font-semibold text-xl leading-7 tracking-normal align-middle">
              {t('codeTitle')}
            </h3>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <div className="flex flex-col gap-2 mb-4 w-full sm:justify-end sm:flex-row">
              <Select value={generator} onValueChange={handleGeneratorChange}>
                <SelectTrigger
                  className="w-[200px] cursor-pointer dark:bg-neutral-400 hover:dark:bg-neutral-400"
                  aria-label="Code generators Selector"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-400">
                  {generators.map((generator) => (
                    <SelectItem
                      key={generator.value}
                      value={generator.value}
                      className="cursor-pointer"
                    >
                      {generator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerate}
                className="w-[200px] cursor-pointer bg-purple-900 hover:bg-purple-900 text-white"
              >
                {t('codeButton')}
              </Button>
            </div>
            <Button
              onClick={handleCopy}
              className="block border rounded-lg mb-4 p-2 ml-auto bg-white text-black dark:bg-neutral-600 dark:text-white cursor-pointer"
            >
              {copied ? <Copy /> : <ClipboardList />}
            </Button>
            <Textarea
              value={generatedCode}
              readOnly
              placeholder="curl https://jsonplaceholder.typicode.com/posts/1"
              className="min-h-25"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
