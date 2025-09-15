import { Button } from '@/components/ui/button';

interface NoVariablesProps {
  onAddVariable: () => void;
}

export default function NoVariables({
  onAddVariable,
}: Readonly<NoVariablesProps>) {
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-4 text-xl mb-12 font-medium">
        There is no variable here
      </div>
      <Button
        onClick={onAddVariable}
        className="flex items-center mx-auto flex items-center  bg-violet-800 hover:bg-violet-900 dark:bg-neutral-50 text-white dark:text-violet-800 dark:hover:bg-violet-200 text-xl px-9 py-2"
      >
        Add Variable
      </Button>
    </div>
  );
}
