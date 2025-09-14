import { useEffect, useState } from 'react';

interface EnvVariables {
  [key: string]: string;
}

interface VariablesData {
  [envName: string]: EnvVariables;
}

export const useEnvVariables = () => {
  const [variables, setVariables] = useState<VariablesData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem('variables');
        if (stored) {
          setVariables(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading variables from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFromStorage();
  }, []);
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('variables', JSON.stringify(variables));
    }
  }, [variables, loading]);

  const getEnv = (): string[] => {
    return Object.keys(variables);
  };

  const getEnvVariables = (envName: string): EnvVariables => {
    return variables[envName] || {};
  };

  const getCurrentFromStorage = (): VariablesData => {
    try {
      const stored = localStorage.getItem('variables');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  };

  const addEnv = (envName: string, initialVariables: EnvVariables = {}) => {
    setVariables((prev) => ({
      ...prev,
      [envName]: initialVariables,
    }));
  };

  const removeEnv = (envName: string) => {
    setVariables((prev) => {
      const newVars = { ...prev };
      delete newVars[envName];
      return newVars;
    });
  };

  const setVariable = (envName: string, varName: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [envName]: {
        ...prev[envName],
        [varName]: value,
      },
    }));
  };

  const removeVariable = (envName: string, varName: string) => {
    setVariables((prev) => {
      if (!prev[envName]) return prev;

      const newEnvVars = { ...prev[envName] };
      delete newEnvVars[varName];

      return {
        ...prev,
        [envName]: newEnvVars,
      };
    });
  };

  const renameEnv = (oldName: string, newName: string) => {
    const currentData = getCurrentFromStorage();
    console.log(JSON.stringify(currentData));
    if (!currentData[oldName]) return;

    const newVars = { ...currentData };
    newVars[newName] = { ...newVars[oldName] };
    delete newVars[oldName];

    setVariables(newVars);
    saveToStorage(newVars);
  };

  const saveToStorage = (data: VariablesData) => {
    try {
      localStorage.setItem('variables', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const clearEnv = (envName: string) => {
    setVariables((prev) => ({
      ...prev,
      [envName]: {},
    }));
  };

  const environmentExists = (envName: string): boolean => {
    return envName in variables;
  };

  const variableExists = (envName: string, varName: string): boolean => {
    return variables[envName]?.[varName] !== undefined;
  };

  return {
    variables,
    loading,
    getEnv,
    getEnvVariables,
    addEnv,
    removeEnv,
    setVariable,
    removeVariable,
    renameEnv,
    clearEnv,
    environmentExists,
    variableExists,
  };
};
