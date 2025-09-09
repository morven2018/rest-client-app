import { Button } from '@/components/ui/button';
import { Save, ClipboardList } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';

export default function SectionBody() {
  const t = useTranslations('RestClient');

  return (
    <>
      <div className="flex justify-between h-20 items-center">
        <h3>{t('bodyTitle')}</h3>
        <div className="flex gap-2">
          <Button>
            <Save />
          </Button>
          <Button>
            <ClipboardList />
          </Button>
        </div>
      </div>
      <Textarea
        placeholder="curl https://jsonplaceholder.typicode.com/posts/1"
        className="min-h-40"
      />
    </>
  );
}
