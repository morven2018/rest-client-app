import { Button } from '@/components/ui/button';
import HeadersTable from './HeadersTable';
import { useTranslations } from 'next-intl';
import type { Header } from '@/app/[locale]/restful/[[...rest]]/page';
import { Plus } from 'lucide-react';

interface SectionHeadersProps {
  headers: Header[];
  onHeadersChange: (headers: Header[]) => void;
}

export default function SectionHeaders({
  headers,
  onHeadersChange,
}: SectionHeadersProps) {
  const t = useTranslations('RestClient');

  const addHeader = () => {
    onHeadersChange([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    onHeadersChange(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    onHeadersChange(newHeaders);
  };

  return (
    <section className="flex flex-col gap-4 px-6 py-5 border-t border-t-black">
      <div className="flex justify-between items-center pl-6 pr-6">
        <h3>{t('headersTitle')}</h3>
        <Button
          variant="outline"
          onClick={addHeader}
          className="cursor-pointer"
        >
          <Plus />
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
    </section>
  );
}
