import { useTranslations } from 'next-intl';
import { Trash } from 'lucide-react';
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
  readonly headers: { key: string; value: string }[];
  readonly onRemove: (index: number) => void;
  readonly onUpdate: (
    index: number,
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-11" />
          <TableHead>{t('headerKey')}</TableHead>
          <TableHead>{t('headerValue')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {headers.map((header, index) => (
          <TableRow key={index}>
            <TableCell className="px-2 py-3">
              <Button onClick={() => onRemove(index)}>
                <Trash className="w-7 h-7" />
              </Button>
            </TableCell>
            <TableCell>
              <Input
                value={header.key}
                onChange={(e) => onUpdate(index, 'key', e.target.value)}
                placeholder="key"
              />
            </TableCell>
            <TableCell>
              <Input
                value={header.value}
                onChange={(e) => onUpdate(index, 'value', e.target.value)}
                placeholder="value"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
