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

  // Загрузка данных из LocalStorage
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

  // Сохранение в LocalStorage при изменении
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('variables', JSON.stringify(variables));
    }
  }, [variables, loading]);

  // Получить все окружения
  const getEnv = (): string[] => {
    return Object.keys(variables);
  };

  // Получить переменные конкретного окружения
  const getEnvVariables = (envName: string): EnvVariables => {
    return variables[envName] || {};
  };

  // Добавить новое окружение
  const addEnv = (envName: string, initialVariables: EnvVariables = {}) => {
    setVariables((prev) => ({
      ...prev,
      [envName]: initialVariables,
    }));
  };

  // Удалить окружение целиком
  const removeEnv = (envName: string) => {
    setVariables((prev) => {
      const newVars = { ...prev };
      delete newVars[envName];
      return newVars;
    });
  };

  // Добавить/изменить переменную в окружении
  const setVariable = (envName: string, varName: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [envName]: {
        ...prev[envName],
        [varName]: value,
      },
    }));
  };

  // Удалить переменную из окружения
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

  // Переименовать окружение
  const renameEnv = (oldName: string, newName: string) => {
    setVariables((prev) => {
      if (!prev[oldName]) return prev;

      const newVars = { ...prev };
      newVars[newName] = newVars[oldName];
      delete newVars[oldName];

      return newVars;
    });
  };

  // Очистить все переменные окружения
  const clearEnv = (envName: string) => {
    setVariables((prev) => ({
      ...prev,
      [envName]: {},
    }));
  };

  // Проверить существует ли окружение
  const environmentExists = (envName: string): boolean => {
    return envName in variables;
  };

  // Проверить существует ли переменная в окружении
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
