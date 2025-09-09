import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function SectionRequestField() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const t = useTranslations('RestClient');

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  const handleMethodChange = (value: string) => {
    setMethod(value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSend = () => {
    console.log('Method:', method);
    console.log('URL:', url);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-5 rounded-lg bg-request-field-bg">
      <Select value={method} onValueChange={handleMethodChange}>
        <SelectTrigger
          className="w-[200px] md:w-[100px] lg:w-[200px] cursor-pointer"
          aria-label="HTTP Method Selector"
        >
          <SelectValue placeholder="Method" />
        </SelectTrigger>
        <SelectContent className="dark:bg-chart-1">
          {methods.map((method) => (
            <SelectItem key={method} value={method} className="cursor-pointer">
              {method}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id="url"
        placeholder="Endpoint URL"
        value={url}
        onChange={handleUrlChange}
        className="flex-1"
      />
      <Button
        variant="outline"
        onClick={handleSend}
        className="bg-request-button-bg cursor-pointer"
      >
        {t('buttonSend')}
      </Button>
    </div>
  );
}
