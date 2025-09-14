'use client';
import { ArrowUpDown, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { usePathname } from '@/i18n/navigation';

export default function EnvironmentVariablesList() {
  const pathname = usePathname();
  const links = pathname.split('/').filter(Boolean);
  const currentEnvName = links[1] || '';

  const {
    getEnvVariables,
    setVariable,
    removeVariable,
    addEnv,
    environmentExists,
  } = useEnvVariables();

  const [variables, setVariables] = useState<Record<string, string>>({});
  const [selectedVars, setSelectedVars] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'value'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (currentEnvName) {
      const envVariables = getEnvVariables(currentEnvName);
      setVariables(envVariables);
      setSelectedVars(new Set());
      setIsAllSelected(false);
    }
  }, [currentEnvName]);

  useEffect(() => {
    setIsAllSelected(
      selectedVars.size > 0 &&
        selectedVars.size === Object.keys(variables).length
    );
  }, [selectedVars, variables]);

  const sortedVariables = useCallback(() => {
    const entries = Object.entries(variables);

    return entries.sort(([aName, aValue], [bName, bValue]) => {
      let aCompare, bCompare;

      if (sortBy === 'name') {
        aCompare = aName.toLowerCase();
        bCompare = bName.toLowerCase();
      } else {
        aCompare = aValue.toLowerCase();
        bCompare = bValue.toLowerCase();
      }

      if (aCompare < bCompare) return sortOrder === 'asc' ? -1 : 1;
      if (aCompare > bCompare) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [variables, sortBy, sortOrder]);

  const handleSort = (column: 'name' | 'value') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleVariableValueChange = useCallback(
    (varName: string, newValue: string) => {
      if (currentEnvName) {
        setVariable(currentEnvName, varName, newValue);
        setVariables((prev) => ({ ...prev, [varName]: newValue }));
      }
    },
    [currentEnvName, setVariable]
  );

  const handleVariableNameChange = useCallback(
    (oldName: string, newName: string) => {
      if (currentEnvName && newName.trim() && newName !== oldName) {
        if (variables[newName] !== undefined) {
          return;
        }

        const oldValue = variables[oldName];

        removeVariable(currentEnvName, oldName);
        setVariable(currentEnvName, newName, oldValue);

        setVariables((prev) => {
          const newVars = { ...prev };
          delete newVars[oldName];
          newVars[newName] = oldValue;
          return newVars;
        });

        setSelectedVars((prev) => {
          const newSelected = new Set(prev);
          if (newSelected.has(oldName)) {
            newSelected.delete(oldName);
            newSelected.add(newName);
          }
          return newSelected;
        });
      }
    },
    [currentEnvName, variables, removeVariable, setVariable]
  );

  const handleDeleteVariable = useCallback(
    (varName: string) => {
      if (currentEnvName) {
        removeVariable(currentEnvName, varName);
        setVariables((prev) => {
          const newVars = { ...prev };
          delete newVars[varName];
          return newVars;
        });
        setSelectedVars((prev) => {
          const newSelected = new Set(prev);
          newSelected.delete(varName);
          return newSelected;
        });
      }
    },
    [currentEnvName, removeVariable]
  );

  const handleAddVariable = useCallback(() => {
    if (currentEnvName) {
      if (!environmentExists(currentEnvName)) {
        addEnv(currentEnvName, {});
      }

      const newVarName = `VAR_${Object.keys(variables).length + 1}`;
      const newValue = '';

      setVariable(currentEnvName, newVarName, newValue);
      setVariables((prev) => ({ ...prev, [newVarName]: newValue }));
    }
  }, [currentEnvName, environmentExists, addEnv, setVariable, variables]);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedVars(new Set());
    } else {
      setSelectedVars(new Set(Object.keys(variables)));
    }
  }, [isAllSelected, variables]);

  const handleSelectVariable = useCallback((varName: string) => {
    setSelectedVars((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(varName)) {
        newSelected.delete(varName);
      } else {
        newSelected.add(varName);
      }
      return newSelected;
    });
  }, []);

  const handleRemoveSelected = useCallback(() => {
    if (currentEnvName && selectedVars.size > 0) {
      const varsToDelete = new Set(selectedVars);

      varsToDelete.forEach((varName) => {
        removeVariable(currentEnvName, varName);
      });

      setVariables((prev) => {
        const newVars = { ...prev };
        varsToDelete.forEach((varName) => delete newVars[varName]);
        return newVars;
      });

      setSelectedVars(new Set());
    }
  }, [currentEnvName, selectedVars, removeVariable]);

  if (!currentEnvName) {
    return <div>Select an environment to view variables</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-4 w-full justify-end">
        <Button onClick={handleAddVariable} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Variable
        </Button>
        {selectedVars.size > 0 && (
          <Button
            onClick={handleRemoveSelected}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remove selected ({selectedVars.size})
          </Button>
        )}
      </div>
      <div className="grid grid-cols-[50px_1fr_1fr_80px] gap-2 items-center p-3 bg-muted rounded-lg">
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="h-4 w-4"
          />
        </div>

        <button
          onClick={() => handleSort('name')}
          className="flex items-center gap-2 font-semibold text-left hover:bg-muted-foreground/10 p-2 rounded"
        >
          <span>Variable</span>
          <ArrowUpDown className="h-4 w-4" />
          {sortBy === 'name' && (
            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>

        <div className="flex items-center gap-2 font-semibold text-left hover:bg-muted-foreground/10 p-2 rounded">
          <span>Value</span>
        </div>
      </div>

      <div className="space-y-2">
        {sortedVariables().map(([varName, varValue]) => (
          <div
            key={varName}
            className="grid grid-cols-[50px_1fr_1fr_80px] gap-2 items-center p-3 border rounded-lg"
          >
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={selectedVars.has(varName)}
                onChange={() => handleSelectVariable(varName)}
                className="h-4 w-4"
              />
            </div>

            <Input
              ref={(el) => (inputRefs.current[varName] = el)}
              value={varName}
              onChange={(e) =>
                handleVariableNameChange(varName, e.target.value)
              }
              className="font-mono text-sm"
              placeholder="Variable name"
            />

            <Input
              value={varValue}
              onChange={(e) =>
                handleVariableValueChange(varName, e.target.value)
              }
              className="font-mono text-sm"
              placeholder="Value"
            />

            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteVariable(varName)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(variables).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No variables yet. Click "Add Variable" to create your first variable.
        </div>
      )}
    </div>
  );
}
