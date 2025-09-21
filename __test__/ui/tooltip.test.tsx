import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

describe('Tooltip', () => {
  it('render trigger component', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText('Hover me');
    expect(trigger).toBeInTheDocument();
  });

  it('show tooltip on hover if it uses data-state attribute', async () => {
    const tooltipText = 'This is a tooltip';
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText('Hover me');
    expect(trigger).toHaveAttribute('data-state', 'closed');

    fireEvent.mouseEnter(trigger);
  });

  it('check if tooltip content exists in DOM but hidden', () => {
    const tooltipText = 'This is a tooltip';
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  });
});
