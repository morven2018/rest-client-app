'use client';
import { ArrowUpDown, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { usePathname } from '@/i18n/navigation';

export default function EnvironmentVariablesList() {
  const pathname = usePathname();
  const links = pathname.split('/').filter(Boolean);

  const currentEnvName = links[1] ? decodeURIComponent(links[1]) : '';

  const { setVariable, removeVariable } = useEnvVariables();

  const [variables, setVariables] = useState<Record<string, string>>({});
  const [selectedVars, setSelectedVars] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'value'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [focusedInput, setFocusedInput] = useState<{
    type: 'name' | 'value';
    varName: string;
  } | null>(null);
  const inputRefs = useRef<
    Map<
      string,
      { name: HTMLInputElement | null; value: HTMLInputElement | null }
    >
  >(new Map());

  const initializeInputRef = useCallback((varName: string) => {
    if (!inputRefs.current.has(varName)) {
      inputRefs.current.set(varName, { name: null, value: null });
    }
  }, []);

  const setInputRef = useCallback(
    (varName: string, type: 'name' | 'value') =>
      (el: HTMLInputElement | null) => {
        if (el) {
          if (!inputRefs.current.has(varName)) {
            inputRefs.current.set(varName, { name: null, value: null });
          }
          const refs = inputRefs.current.get(varName)!;
          if (type === 'name') {
            refs.name = el;
          } else {
            refs.value = el;
          }
        }
      },
    []
  );

  useEffect(() => {
    if (focusedInput) {
      const refs = inputRefs.current.get(focusedInput.varName);
      if (refs) {
        const inputElement =
          focusedInput.type === 'name' ? refs.name : refs.value;
        if (inputElement) {
          setTimeout(() => {
            inputElement.focus();
            const length = inputElement.value.length;
            inputElement.setSelectionRange(length, length);
          }, 0);
        }
      }
    }
  }, [variables, focusedInput]);

  const loadVariablesDirectly = useCallback(() => {
    if (currentEnvName) {
      try {
        const stored = localStorage.getItem('variables');
        if (stored) {
          const allVariables = JSON.parse(stored);
          const envVariables = allVariables[currentEnvName] || {};
          setVariables(envVariables);
          Object.keys(envVariables).forEach(initializeInputRef);
        } else {
          setVariables({});
        }
      } catch (error) {
        console.error('Error loading variables from localStorage:', error);
        setVariables({});
      }
      setSelectedVars(new Set());
      setIsAllSelected(false);
    }
  }, [currentEnvName, initializeInputRef]);

  useEffect(() => {
    loadVariablesDirectly();
  }, [loadVariablesDirectly]);

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
        const wasFocused = focusedInput?.varName === oldName;

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

        const oldRefs = inputRefs.current.get(oldName);
        if (oldRefs) {
          inputRefs.current.set(newName, oldRefs);
          inputRefs.current.delete(oldName);
        }

        if (wasFocused) {
          setFocusedInput({ type: 'name', varName: newName });
        }
      }
    },
    [currentEnvName, variables, removeVariable, setVariable, focusedInput]
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
        inputRefs.current.delete(varName);
      }
    },
    [currentEnvName, removeVariable]
  );

  const handleAddVariable = useCallback(() => {
    if (currentEnvName) {
      const newVarName = `variable_${Object.keys(variables).length + 1}`;
      const newValue = '';

      setVariable(currentEnvName, newVarName, newValue);
      setVariables((prev) => ({ ...prev, [newVarName]: newValue }));
      initializeInputRef(newVarName);

      setTimeout(() => {
        setFocusedInput({ type: 'name', varName: newVarName });
      }, 0);
    }
  }, [currentEnvName, setVariable, variables, initializeInputRef]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedVars(new Set(Object.keys(variables)));
      } else {
        setSelectedVars(new Set());
      }
    },
    [variables]
  );

  const handleSelectVariable = useCallback(
    (varName: string, checked: boolean) => {
      setSelectedVars((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(varName);
        } else {
          newSelected.delete(varName);
        }
        return newSelected;
      });
    },
    []
  );

  const handleRemoveSelected = useCallback(() => {
    if (currentEnvName && selectedVars.size > 0) {
      const varsToDelete = new Set(selectedVars);

      varsToDelete.forEach((varName) => {
        removeVariable(currentEnvName, varName);
        inputRefs.current.delete(varName);
      });

      setVariables((prev) => {
        const newVars = { ...prev };
        varsToDelete.forEach((varName) => delete newVars[varName]);
        return newVars;
      });

      setSelectedVars(new Set());
    }
  }, [currentEnvName, selectedVars, removeVariable]);

  const handleFocus = useCallback((varName: string, type: 'name' | 'value') => {
    setFocusedInput({ varName, type });
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedInput(null);
  }, []);

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
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
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

        <button
          onClick={() => handleSort('value')}
          className="flex items-center gap-2 font-semibold text-left hover:bg-muted-foreground/10 p-2 rounded"
        >
          <span>Value</span>
          <ArrowUpDown className="h-4 w-4" />
          {sortBy === 'value' && (
            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
      </div>

      <div className="space-y-2">
        {sortedVariables().map(([varName, varValue], index) => (
          <div
            key={varName}
            className={`grid grid-cols-[50px_1fr_1fr_80px] gap-2 items-center p-3 border rounded-lg ${index % 2 === 0 ? 'bg-violet-50' : ''}`}
          >
            <div className="flex justify-center">
              <Checkbox
                checked={selectedVars.has(varName)}
                onCheckedChange={(checked) =>
                  handleSelectVariable(varName, checked === true)
                }
                className="h-4 w-4"
              />
            </div>

            <Input
              ref={setInputRef(varName, 'name')}
              value={varName}
              onChange={(e) =>
                handleVariableNameChange(varName, e.target.value)
              }
              onFocus={() => handleFocus(varName, 'name')}
              onBlur={handleBlur}
              className="font-mono text-sm"
              placeholder="Variable name"
            />

            <Input
              ref={setInputRef(varName, 'value')}
              value={varValue}
              onChange={(e) =>
                handleVariableValueChange(varName, e.target.value)
              }
              onFocus={() => handleFocus(varName, 'value')}
              onBlur={handleBlur}
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
