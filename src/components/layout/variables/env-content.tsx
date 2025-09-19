'use client';
import EnvButtons from './env-buttons';
import EnvTable from './env-table';
import NoVariables from './no-variables';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEnvVariables } from '@/hooks/use-env-variables';

export default function EnvironmentVariablesContent() {
  const {
    variables: storedVariables,
    setVariable,
    removeVariable,
  } = useEnvVariables();

  const [variables, setVariables] = useState<Record<string, string>>({});
  const [selectedVars, setSelectedVars] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedVariables');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
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

  useEffect(() => {
    localStorage.setItem(
      'selectedVariables',
      JSON.stringify(Array.from(selectedVars))
    );
  }, [selectedVars]);

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
  }, [focusedInput]);

  const loadVariablesDirectly = useCallback(() => {
    try {
      const stored = localStorage.getItem('variables');
      if (stored) {
        const envVariables = JSON.parse(stored);
        setVariables(envVariables);
        Object.keys(envVariables).forEach(initializeInputRef);

        setSelectedVars((prev) => {
          const newSelected = new Set<string>();
          prev.forEach((varName) => {
            if (envVariables[varName] !== undefined) {
              newSelected.add(varName.toString());
            }
          });
          return newSelected;
        });
      } else {
        setVariables({});
        setSelectedVars(new Set());
      }
    } catch {
      setVariables({});
      setSelectedVars(new Set());
    }
  }, [initializeInputRef]);

  useEffect(() => {
    loadVariablesDirectly();
  }, [loadVariablesDirectly, storedVariables]);

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
      setVariable(varName, newValue);
      setVariables((prev) => ({ ...prev, [varName]: newValue }));
    },
    [setVariable]
  );

  const handleVariableNameChange = useCallback(
    (oldName: string, newName: string) => {
      if (newName.trim() && newName !== oldName) {
        if (variables[newName] !== undefined) {
          return;
        }

        const oldValue = variables[oldName];
        const wasFocused = focusedInput?.varName === oldName;

        removeVariable(oldName);
        setVariable(newName, oldValue);

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
    [variables, removeVariable, setVariable, focusedInput]
  );

  const handleDeleteVariable = useCallback(
    (varName: string) => {
      removeVariable(varName);
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
    },
    [removeVariable]
  );

  const handleAddVariable = useCallback(() => {
    const newVarName = `variable_${Object.keys(variables).length + 1}`;
    const newValue = '';

    setVariable(newVarName, newValue);
    setVariables((prev) => ({ ...prev, [newVarName]: newValue }));
    initializeInputRef(newVarName);

    setTimeout(() => {
      setFocusedInput({ type: 'name', varName: newVarName });
    }, 0);
  }, [setVariable, initializeInputRef, variables]);

  const handleSelectAll = useCallback(() => {
    setSelectedVars(new Set(Object.keys(variables)));
  }, [variables]);

  const handleDeselectAll = useCallback(() => {
    setSelectedVars(new Set());
  }, []);

  const handleSelectVariable = useCallback((varName: string) => {
    setSelectedVars((prev) => {
      const newSelected = new Set(prev);
      newSelected.add(varName);
      return newSelected;
    });
  }, []);

  const handleDeselectVariable = useCallback((varName: string) => {
    setSelectedVars((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(varName);
      return newSelected;
    });
  }, []);

  const handleRemoveSelected = useCallback(() => {
    if (selectedVars.size > 0) {
      const varsToDelete = new Set(selectedVars);

      varsToDelete.forEach((varName) => {
        removeVariable(varName);
        inputRefs.current.delete(varName);
      });

      setVariables((prev) => {
        const newVars = { ...prev };
        varsToDelete.forEach((varName) => delete newVars[varName]);
        return newVars;
      });

      setSelectedVars(new Set());
    }
  }, [selectedVars, removeVariable]);

  const handleFocus = useCallback((varName: string, type: 'name' | 'value') => {
    setFocusedInput({ varName, type });
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedInput(null);
  }, []);

  const hasVariables = Object.keys(variables).length > 0;
  const tableVariables = sortedVariables().map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <>
      {hasVariables && (
        <EnvButtons
          selectedCount={selectedVars.size}
          onAddVariable={handleAddVariable}
          onRemoveSelected={handleRemoveSelected}
        />
      )}
      {hasVariables ? (
        <EnvTable
          variables={tableVariables}
          selectedVars={selectedVars}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onSelectVariable={handleSelectVariable}
          onDeselectVariable={handleDeselectVariable}
          onNameChange={handleVariableNameChange}
          onValueChange={handleVariableValueChange}
          onDeleteVariable={handleDeleteVariable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          setInputRef={setInputRef}
        />
      ) : (
        <NoVariables onAddVariable={handleAddVariable} />
      )}
    </>
  );
}
