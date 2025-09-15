'use client';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { useRouter } from '@/i18n/navigation';

const VariablesContent = () => {
  const { variables, getEnv, removeEnv, addEnv } = useEnvVariables();
  const [selectedEnvs, setSelectedEnvs] = useState<Set<string>>(new Set());
  const [showDeleteSelected, setShowDeleteSelected] = useState(false);
  const t = useTranslations('variables');

  useEffect(() => {
    setShowDeleteSelected(selectedEnvs.size > 0);
  }, [selectedEnvs.size]);

  const handleSelectEnv = (envName: string, selected: boolean) => {
    setSelectedEnvs((prev) => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(envName);
      } else {
        newSelected.delete(envName);
      }
      return newSelected;
    });
  };

  const handleDeleteEnv = (envName: string) => {
    removeEnv(envName);
    setSelectedEnvs((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(envName);
      return newSelected;
    });
  };

  const handleDeleteSelected = () => {
    selectedEnvs.forEach((envName) => removeEnv(envName));
    setSelectedEnvs(new Set());
  };

  const handleDeleteAll = () => {
    const envs = getEnv();
    envs.forEach((envName) => removeEnv(envName));
    setSelectedEnvs(new Set());
  };

  const handleAddEnv = () => {
    let newEnvName = 'New Environment';
    let counter = 1;

    while (envs.includes(newEnvName)) {
      newEnvName = `New environment ${counter}`;
      counter++;
    }

    addEnv(newEnvName);
  };

  const envs = getEnv();

  return (
    <div>
      <header>
        <div className="flex flex-row gap-4 py-3 justify-end pb-6">
          <Button
            onClick={handleAddEnv}
            className="flex items-center gap-2  bg-purple-800 hover:bg-purple-900 dark:bg-neutral-50 text-white dark:text-purple-800 dark:hover:bg-purple-200"
          >
            <Plus className="h-4 w-4" />
            {t('add')}
          </Button>
          {showDeleteSelected && (
            <Button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2  bg-violet-800 hover:bg-violet-900 dark:bg-neutral-50 text-white dark:text-violet-800 dark:hover:bg-violet-200"
            >
              {t('delete-selected-env')}
            </Button>
          )}
          {envs.length > 0 && (
            <Button
              onClick={handleDeleteAll}
              className="flex items-center gap-2  bg-indigo-800 hover:bg-indigo-900 dark:bg-neutral-50 text-white dark:text-indigo-800 dark:hover:bg-indigo-200"
            >
              {t('delete-all-env')}
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-3 justify-center">
        {envs.length === 0 ? (
          <div>{t('no-environments')}</div>
        ) : (
          envs.map((envName) => (
            <Card
              key={envName}
              envName={envName}
              variablesCount={Object.keys(variables[envName] || {}).length}
              isSelected={selectedEnvs.has(envName)}
              onSelect={handleSelectEnv}
              onDelete={handleDeleteEnv}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface EnvCardProps {
  envName: string;
  variablesCount: number;
  isSelected: boolean;
  onSelect: (envName: string, selected: boolean) => void;
  onDelete: (envName: string) => void;
}

const Card = ({
  envName,
  variablesCount,
  isSelected,
  onSelect,
  onDelete,
}: EnvCardProps) => {
  const router = useRouter();
  const t = useTranslations('variables');

  const handleCardClick = () => {
    router.push(`/variables/${envName}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(envName);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onSelect(envName, checked);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-60 flex flex-col gap-4 p-4 bg-neutral-200 rounded-lg dark:bg-neutral-600 mb-5"
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          title={t('select-env')}
          className="mt-1 bg-white h-4 w-4 dark:border-neutral-400"
        />
        <h5 className="env-name font-medium text-md text-center w-full text-neutral-800 dark:text-neutral-100">
          {envName}
        </h5>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {t('vars')} {variablesCount}
      </span>
      <Button
        onClick={handleDeleteClick}
        className="flex items-center gap-2  bg-violet-800 hover:bg-violet-900 dark:bg-neutral-50 text-white dark:text-violet-800 dark:hover:bg-violet-200"
      >
        {t('delete-env')}
      </Button>
    </div>
  );
};

export default VariablesContent;
