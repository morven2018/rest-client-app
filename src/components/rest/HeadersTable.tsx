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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('headerKey')}</TableHead>
          <TableHead>{t('headerValue')}</TableHead>
          <TableHead className="w-11" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {headers.map((header) => (
          <TableRow key={header.id}>
            <TableCell>
              <Input
                value={header.key}
                onChange={(e) => onUpdate(header.id, 'key', e.target.value)}
                placeholder="key"
              />
            </TableCell>
            <TableCell>
              <Input
                value={header.value}
                onChange={(e) => onUpdate(header.id, 'value', e.target.value)}
                placeholder="value"
              />
            </TableCell>
            <TableCell className="px-2 py-3">
              <Button
                className="cursor-pointer"
                onClick={() => onRemove(header.id)}
              >
                <Trash className="w-7 h-7" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
