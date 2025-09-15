'use client';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnvButtonsProps {
  hasVariables: boolean;
  selectedCount: number;
  onAddVariable: () => void;
  onRemoveSelected: () => void;
}

export default function EnvButtons({
  hasVariables,
  selectedCount,
  onAddVariable,
  onRemoveSelected,
}: Readonly<EnvButtonsProps>) {
  return (
    <div className="flex flex-row gap-4 w-full justify-end my-4 px-6 max-[500px]:pl-1 text-sm">
      <Button onClick={onAddVariable} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Variable
      </Button>
      {selectedCount > 0 && (
        <Button
          onClick={onRemoveSelected}
          className="flex items-center gap-2"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
          Remove selected ({selectedCount})
        </Button>
      )}
    </div>
  );
}
