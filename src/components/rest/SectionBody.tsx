import { Button } from '@/components/ui/button';
import { Save, ClipboardList } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function SectionBody() {
  const t = useTranslations('RestClient');

  return (
    <section className="px-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            {t('bodyTitle')}
            <div className="flex gap-2 w-full justify-end">
              <Button>
                <Save />
              </Button>
              <Button>
                <ClipboardList />
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <Textarea
              placeholder="curl https://jsonplaceholder.typicode.com/posts/1"
              className="min-h-40"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
