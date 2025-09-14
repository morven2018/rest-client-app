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
import { RequestData } from '@/app/[locale]/restful/[[...rest]]/page';

interface SectionRequestFieldProps {
  requestData: RequestData;
  onRequestDataChange: (data: Partial<RequestData>) => void;
  onSendRequest: () => void;
  isLoading?: boolean;
}

export default function SectionRequestField({
  requestData,
  onRequestDataChange,
  onSendRequest,
  isLoading = false,
}: SectionRequestFieldProps) {
  const t = useTranslations('RestClient');

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  const handleMethodChange = (value: string) => {
    onRequestDataChange({ method: value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRequestDataChange({ url: e.target.value });
  };

  const handleSend = () => {
    if (!requestData.url.trim()) return;
    try {
      new URL(requestData.url);
      onSendRequest();
    } catch (error) {
      console.error('Invalid URL:', error);
    }
  };

  return (
    <section className="px-6">
      <div className="flex flex-col sm:flex-row gap-2 p-5 rounded-lg bg-request-field-bg">
        <Select value={requestData.method} onValueChange={handleMethodChange}>
          <SelectTrigger
            className="w-[200px] md:w-[100px] lg:w-[200px] cursor-pointer"
            aria-label="HTTP Method Selector"
          >
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent className="dark:bg-chart-1">
            {methods.map((method) => (
              <SelectItem
                key={method}
                value={method}
                className="cursor-pointer"
              >
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="url"
          placeholder="Endpoint URL"
          value={requestData.url}
          onChange={handleUrlChange}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={handleSend}
          disabled={isLoading || !requestData.url.trim()}
          className="bg-request-button-bg cursor-pointer"
        >
          {t('buttonSend')}
        </Button>
      </div>
    </section>
  );
}
