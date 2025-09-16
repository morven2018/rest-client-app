import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import HeadersTable from './HeadersTable';
import { useTranslations } from 'next-intl';
import type { Header } from '@/app/[locale]/restful/[[...rest]]/page';
import { Plus } from 'lucide-react';

interface SectionHeadersProps {
  readonly headers: Header[];
  readonly onHeadersChange: (headers: Header[]) => void;
}

export default function SectionHeaders({
  headers,
  onHeadersChange,
}: SectionHeadersProps) {
  const [headersWithId, setHeadersWithId] = useState<
    { id: string; key: string; value: string }[]
  >([]);

  const t = useTranslations('RestClient');

  useEffect(() => {
    setHeadersWithId((prev) => {
      if (prev.length === headers.length) {
        return prev.map((item, index) => ({
          id: item.id,
          ...headers[index],
        }));
      }
      return headers.map((header) => ({
        id: crypto.randomUUID(),
        ...header,
      }));
    });
  }, [headers]);

  const addHeader = () => {
    const newHeader = { id: crypto.randomUUID(), key: '', value: '' };
    setHeadersWithId((prev) => [...prev, newHeader]);
    onHeadersChange([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (id: string) => {
    setHeadersWithId((prev) => prev.filter((h) => h.id !== id));
    const index = headersWithId.findIndex((h) => h.id === id);
    if (index !== -1) {
      onHeadersChange(headers.filter((_, i) => i !== index));
    }
  };

  const updateHeader = (id: string, field: 'key' | 'value', value: string) => {
    setHeadersWithId((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );

    const index = headersWithId.findIndex((h) => h.id === id);
    if (index !== -1) {
      const newHeaders = [...headers];
      newHeaders[index] = { ...newHeaders[index], [field]: value };
      onHeadersChange(newHeaders);
    }
  };

  return (
    <section className="flex flex-col gap-4 px-6 py-5">
      <div className="flex justify-between items-center">
        <h3 className="font-sans font-semibold text-xl leading-7 tracking-normal align-middle">
          {t('headersTitle')}
        </h3>
        <Button
          variant="outline"
          onClick={addHeader}
          className="bg-violet-200 dark:bg-violet-300 cursor-pointer"
        >
          <Plus />
        </Button>
      </div>
      <div>
        {headersWithId.length === 0 ? (
          <div className="text-xl text-center font-medium">
            <p className="font-sans font-medium text-xl leading-7 tracking-normal">
              {t('noHeadersText')}
            </p>
            <Button
              variant="default"
              onClick={addHeader}
              className="mt-5 bg-purple-900 text-white cursor-pointer"
            >
              {t('buttonAddHeader')}
            </Button>
          </div>
        ) : (
          <HeadersTable
            headers={headersWithId}
            onRemove={removeHeader}
            onUpdate={updateHeader}
          />
        )}
      </div>
    </section>
  );
}
