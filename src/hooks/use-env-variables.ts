import { useEffect, useState } from 'react';
import { toastError } from '@/components/ui/sonner';

interface EnvVariables {
  [key: string]: string;
}

export const useEnvVariables = () => {
  const [variables, setVariables] = useState<EnvVariables>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem('variables');
        if (stored) {
          setVariables(JSON.parse(stored));
        }
      } catch (error) {
        toastError('Error loading variables from localStorage:', {
          additionalMessage:
            error instanceof Error
              ? error.message
              : "Can't loading variables from localStorage",
          duration: 3000,
        });
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

  const getEnvVariables = (): EnvVariables => {
    return variables;
  };

  const setVariable = (varName: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [varName]: value,
    }));
  };

  const removeVariable = (varName: string) => {
    setVariables((prev) => {
      const newVars = { ...prev };
      delete newVars[varName];
      return newVars;
    });
  };

  const clearVariables = () => {
    setVariables({});
  };

  const variableExists = (varName: string): boolean => {
    return variables[varName] !== undefined;
  };

  return {
    variables,
    loading,
    getEnvVariables,
    setVariable,
    removeVariable,
    clearVariables,
    variableExists,
  };
};
