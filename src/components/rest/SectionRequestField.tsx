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
import { useEnvVariables } from '@/hooks/use-env-variables';
import { RequestData } from '@/app/[locale]/restful/[[...rest]]/page';
import { toastError } from '@/components/ui/sonner';

interface SectionRequestFieldProps {
  readonly requestData: RequestData;
  readonly onRequestDataChange: (data: Partial<RequestData>) => void;
  readonly onSendRequest: () => void;
  readonly isLoading?: boolean;
}

export default function SectionRequestField({
  requestData,
  onRequestDataChange,
  onSendRequest,
  isLoading = false,
}: SectionRequestFieldProps) {
  const t = useTranslations('RestClient');
  const { variables, variableExists, variableValue } = useEnvVariables();

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  const handleMethodChange = (value: string) => {
    onRequestDataChange({ method: value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRequestDataChange({ url: e.target.value });
  };

  const substituteVariablesInUrl = (url: string): string => {
    if (!url) return url;

    return url.replace(/{{(\w+)}}/g, (match, varName) => {
      if (variableExists(varName)) {
        return variableValue(varName);
      }

      return match;
    });
  };

  const resolvedUrl = substituteVariablesInUrl(requestData.url);

  const handleSend = () => {
    if (!requestData.url.trim()) return;
    try {
      new URL(resolvedUrl);
      onSendRequest();
    } catch (error) {
      toastError('Invalid URL', {
        additionalMessage:
          error instanceof Error ? error.message : 'Check your URL',
        duration: 3000,
      });
    }
  };

  return (
    <section className="px-6">
      <div className="flex flex-col sm:flex-row gap-2 p-5 rounded-lg bg-violet-200 dark:bg-violet-300">
        <Select value={requestData.method} onValueChange={handleMethodChange}>
          <SelectTrigger
            className="w-[200px] md:w-[100px] lg:w-[200px] bg-white dark:bg-violet-950 dark:hover:bg-violet-950 cursor-pointer"
            aria-label="HTTP Method Selector"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-violet-950">
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
          placeholder={t('placeholderEndpoint')}
          value={requestData.url}
          onChange={handleUrlChange}
          className="flex-1 bg-white dark:bg-violet-950"
        />
        <Button
          variant="outline"
          onClick={handleSend}
          disabled={isLoading || !requestData.url.trim()}
          className="bg-purple-900  text-white dark:bg-violet-200 dark:text-zinc-950 dark:hover:bg-violet-800 hover:bg-purple-800 cursor-pointer"
        >
          {t('buttonSend')}
        </Button>
      </div>
    </section>
  );
}
