import { Button } from '@/components/ui/button';

interface NoVariablesProps {
  onAddVariable: () => void;
}

export default function NoVariables({
  onAddVariable,
}: Readonly<NoVariablesProps>) {
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-4">
        There is no variable here
      </div>
      <Button
        onClick={onAddVariable}
        className="flex items-center gap-2 mx-auto"
      >
        Add Variable
      </Button>
    </div>
  );
}
