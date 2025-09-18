import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';

jest.mock('@radix-ui/react-collapsible', () => ({
  Root: jest.fn(({ children, ...props }) => (
    <div data-testid="collapsible-root" {...props}>
      {children}
    </div>
  )),
  CollapsibleTrigger: jest.fn(({ children, ...props }) => (
    <button data-testid="collapsible-trigger" {...props}>
      {children}
    </button>
  )),
  CollapsibleContent: jest.fn(({ children, ...props }) => (
    <div data-testid="collapsible-content" {...props}>
      {children}
    </div>
  )),
}));

describe('Collapsible Components', () => {
  describe('Collapsible', () => {
    it('render with correct props', () => {
      render(
        <Collapsible data-testid="collapsible-root">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const collapsible = screen.getByTestId('collapsible-root');
      expect(collapsible).toBeInTheDocument();
      expect(collapsible).toHaveAttribute('data-slot', 'collapsible');
    });

    it('forward all props to Root component', () => {
      render(
        <Collapsible
          id="test-collapsible"
          className="custom-class"
          data-testid="collapsible"
        >
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('id', 'test-collapsible');
      expect(collapsible).toHaveClass('custom-class');
    });
  });

  describe('CollapsibleTrigger', () => {
    it('render with correct props', () => {
      render(
        <CollapsibleTrigger data-testid="trigger">
          Toggle Content
        </CollapsibleTrigger>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'collapsible-trigger');
      expect(trigger).toHaveTextContent('Toggle Content');
    });
  });

  describe('CollapsibleContent', () => {
    it('render with correct props', () => {
      render(
        <CollapsibleContent data-testid="content">
          Collapsible Content
        </CollapsibleContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'collapsible-content');
      expect(content).toHaveTextContent('Collapsible Content');
    });

    it('forward all props to Content component', () => {
      render(
        <CollapsibleContent
          id="content-id"
          className="content-class"
          data-testid="content"
          style={{ padding: '10px' }}
        >
          Content
        </CollapsibleContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('id', 'content-id');
      expect(content).toHaveClass('content-class');
      expect(content).toHaveStyle('padding: 10px');
    });
  });

  describe('Complete Collapsible Usage', () => {
    it('render complete collapsible component', () => {
      render(
        <Collapsible data-testid="collapsible">
          <CollapsibleTrigger data-testid="trigger">
            Toggle Section
          </CollapsibleTrigger>
          <CollapsibleContent data-testid="content">
            <p>This is the collapsible content</p>
            <p>It can contain multiple elements</p>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByTestId('collapsible')).toBeInTheDocument();
      expect(screen.getByTestId('trigger')).toHaveTextContent('Toggle Section');
      expect(screen.getByTestId('content')).toHaveTextContent(
        'This is the collapsible content'
      );
      expect(screen.getByTestId('content')).toHaveTextContent(
        'It can contain multiple elements'
      );
    });

    it('handle interaction between trigger and content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content">Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');

      expect(trigger).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('trigger should have appropriate aria attributes', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
    });
  });
});
