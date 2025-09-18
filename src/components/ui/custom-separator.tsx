import * as React from 'react';
import { cn } from '@/lib/utils';

interface SeparatorProps {
  className?: string;
  children?: React.ReactNode;
}

export function CustomSeparator({
  className,
  children,
}: Readonly<SeparatorProps>) {
  return (
    <div
      className={cn('relative flex items-center py-4', className)}
      data-testid="separator"
    >
      <div className="flex-grow border-t border-border"></div>
      {children && (
        <span className="mx-3 flex-shrink text-sm text-muted-foreground">
          {children}
        </span>
      )}
      <div className="flex-grow border-t border-border"></div>
    </div>
  );
}
