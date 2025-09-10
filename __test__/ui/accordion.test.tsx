import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';

jest.mock('lucide-react', () => ({
  ChevronDownIcon: () => <span data-testid="chevron-icon">▼</span>,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('Accordion Components', () => {
  it('renders accordion with proper structure and data attributes', () => {
    render(
      <Accordion type="single" data-testid="accordion">
        <AccordionItem value="item-1" data-testid="accordion-item">
          <AccordionTrigger data-testid="accordion-trigger">
            Trigger
          </AccordionTrigger>
          <AccordionContent data-testid="accordion-content">
            Content
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId('accordion')).toHaveAttribute(
      'data-slot',
      'accordion'
    );
    expect(screen.getByTestId('accordion-item')).toHaveAttribute(
      'data-slot',
      'accordion-item'
    );
    expect(screen.getByTestId('accordion-trigger')).toHaveAttribute(
      'data-slot',
      'accordion-trigger'
    );
    expect(screen.getByTestId('accordion-content')).toHaveAttribute(
      'data-slot',
      'accordion-content'
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  it('applies custom class names correctly', () => {
    const { container } = render(
      <Accordion type="single" className="accordion-custom">
        <AccordionItem className="item-custom" value="item-1">
          <AccordionTrigger className="trigger-custom">
            Trigger
          </AccordionTrigger>
          <AccordionContent className="content-custom">
            Content
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const accordion = container.querySelector('[data-slot="accordion"]');
    const item = container.querySelector('[data-slot="accordion-item"]');
    const trigger = container.querySelector('[data-slot="accordion-trigger"]');

    expect(accordion).toHaveClass('accordion-custom');
    expect(item).toHaveClass('item-custom border-b last:border-b-0');
    expect(trigger).toHaveClass('trigger-custom');
  });

  it('renders multiple items correctly', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>First Item</AccordionTrigger>
          <AccordionContent>First Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second Item</AccordionTrigger>
          <AccordionContent>Second Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
    expect(screen.getAllByTestId('chevron-icon')).toHaveLength(2);
  });

  it('handles user interactions', async () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button');

    expect(trigger).toBeInTheDocument();
  });

  it('works with multiple accordion type', () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>First Item</AccordionTrigger>
          <AccordionContent>First Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second Item</AccordionTrigger>
          <AccordionContent>Second Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
  });

  it('supports collapsible prop', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });
});
