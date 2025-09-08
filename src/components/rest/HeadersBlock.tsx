import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import HeadersTable from './HeadersTable';

export default function HeadersBlock() {
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);

  const t = useTranslations('RestClient');

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  return (
    <>
      <div className="flex justify-between items-center pl-6 pr-6">
        <h3>{t('headersTitle')}</h3>
        <Button
          variant="outline"
          onClick={addHeader}
          className="cursor-pointer"
        >
          {t('buttonAddHeader')}
        </Button>
      </div>
      <div>
        {headers.length === 0 ? (
          <div className="text-xl text-center font-medium">
            <p>{t('noHeadersText')}</p>
            <Button
              variant="default"
              onClick={addHeader}
              className="mt-5 cursor-pointer"
            >
              {t('buttonAddHeader')}
            </Button>
          </div>
        ) : (
          <HeadersTable
            headers={headers}
            onRemove={removeHeader}
            onUpdate={updateHeader}
          />
        )}
      </div>
    </>
  );
}
