import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Save, ClipboardList } from 'lucide-react';

export default function SectionResponse() {
  const t = useTranslations('RestClient');
  return (
    <section className="px-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex items-center min-h-20">
            {t('responseTitle')}
            <div className="w-full">
              <Badge variant="ok">Badge</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-2">
            <div className="flex justify-end gap-2">
              <Button>
                <Save />
              </Button>
              <Button>
                <ClipboardList />
              </Button>
            </div>
            <div className="w-full min-h-75 rounded-[8px] mt-4 bg-chart-5"></div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
