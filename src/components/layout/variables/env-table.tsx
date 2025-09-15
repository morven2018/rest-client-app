'use client';
import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface Variable {
  name: string;
  value: string;
}

interface EnvTableProps {
  variables: Variable[];
  selectedVars: Set<string>;
  sortBy: 'name' | 'value';
  sortOrder: 'asc' | 'desc';
  onSort: (column: 'name' | 'value') => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectVariable: (varName: string) => void;
  onDeselectVariable: (varName: string) => void;
  onNameChange: (oldName: string, newName: string) => void;
  onValueChange: (varName: string, newValue: string) => void;
  onDeleteVariable: (varName: string) => void;
  onFocus: (varName: string, type: 'name' | 'value') => void;
  onBlur: () => void;
  setInputRef: (
    varName: string,
    type: 'name' | 'value'
  ) => (el: HTMLInputElement | null) => void;
}

export default function EnvTable({
  variables,
  selectedVars,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  onDeselectAll,
  onSelectVariable,
  onDeselectVariable,
  onNameChange,
  onValueChange,
  onDeleteVariable,
  onFocus,
  onBlur,
  setInputRef,
}: Readonly<EnvTableProps>) {
  const isAllSelected =
    selectedVars.size > 0 && selectedVars.size === variables.length;

  const handleNameFocus = useCallback(
    (varName: string) => () => {
      onFocus(varName, 'name');
    },
    [onFocus]
  );

  const handleValueFocus = useCallback(
    (varName: string) => () => {
      onFocus(varName, 'value');
    },
    [onFocus]
  );

  return (
    <div className="rounded-md px-6 max-[500px]:pl-1">
      <div className="grid grid-cols-[30px_1fr_1fr_40px] gap-1 py-2 items-center bg-purple-900 text-white rounded-t-md">
        <div className="flex justify-center">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll();
              } else {
                onDeselectAll();
              }
            }}
            className="h-4 w-4 border-none bg-white"
          />
        </div>

        <button
          onClick={() => onSort('name')}
          className="flex items-center justify-between text-left hover:bg-muted-foreground/10 px-4"
        >
          <span>Variable</span>
          {sortBy === 'name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
        </button>

        <div className="flex items-center gap-2 text-left hover:bg-muted-foreground/10">
          <span>Value</span>
        </div>
        <div></div>
      </div>

      <div className="divide-y-1 border rounded-b-lg text-zinc-900 text-base">
        {variables.map(({ name, value }, index) => (
          <div
            key={name}
            className={`grid grid-cols-[30px_1fr_1fr_40px] gap-2 items-center py-2 ${index % 2 === 0 ? 'bg-violet-50' : 'bg-white'}`}
          >
            <div className="flex justify-center">
              <Checkbox
                checked={selectedVars.has(name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectVariable(name);
                  } else {
                    onDeselectVariable(name);
                  }
                }}
                className="h-4 w-4"
              />
            </div>

            <Input
              ref={setInputRef(name, 'name')}
              value={name}
              onChange={(e) => onNameChange(name, e.target.value)}
              onFocus={handleNameFocus(name)}
              onBlur={onBlur}
              className="font-mono text-sm border-violet-200"
              placeholder="Variable"
            />

            <Input
              ref={setInputRef(name, 'value')}
              value={value}
              onChange={(e) => onValueChange(name, e.target.value)}
              onFocus={handleValueFocus(name)}
              onBlur={onBlur}
              className="font-mono text-sm border-violet-200"
              placeholder="Value"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteVariable(name)}
              className="p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
