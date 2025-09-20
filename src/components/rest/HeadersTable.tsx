import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeadersTableProps {
  readonly headers: { id: string; key: string; value: string }[];
  readonly onRemove: (id: string) => void;
  readonly onUpdate: (
    id: string,
    field: 'key' | 'value',
    value: string
  ) => void;
}

export default function HeadersTable({
  headers,
  onRemove,
  onUpdate,
}: HeadersTableProps) {
  const t = useTranslations('RestClient');

  return (
    <Table className="border border-border rounded-md ">
      <TableHeader>
        <TableRow>
          <TableHead className="bg-violet-900 text-white font-sans font-medium text-sm leading-5 tracking-normal">
            {t('headerKey')}
          </TableHead>
          <TableHead className="bg-violet-900 text-white font-sans font-medium text-sm leading-5 tracking-normal">
            {t('headerValue')}
          </TableHead>
          <TableHead className="bg-violet-900 w-11" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {headers.map((header, i) => (
          <TableRow
            key={header.id}
            className={
              i % 2 === 0
                ? 'bg-violet-50 hover:bg-violet-50'
                : 'bg-white hover:bg-white'
            }
          >
            <TableCell>
              <Input
                value={header.key}
                onChange={(e) => onUpdate(header.id, 'key', e.target.value)}
                placeholder={t('placeholderKey')}
                className="text-zinc-950"
              />
            </TableCell>
            <TableCell>
              <Input
                value={header.value}
                onChange={(e) => onUpdate(header.id, 'value', e.target.value)}
                placeholder={t('placeholderValue')}
                className="text-zinc-950"
              />
            </TableCell>
            <TableCell className="px-2 py-3">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 cursor-pointer"
                onClick={() => onRemove(header.id)}
              >
                <Trash2 className="h-4 w-4 text-black" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
