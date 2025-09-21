import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Card Components', () => {
  describe('Card', () => {
    it('should render without throwing errors', () => {
      expect(() => render(<Card>Test Content</Card>)).not.toThrow();
    });

    it('should render children content', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('should apply default className', () => {
      const { container } = render(<Card />);
      const cardElement = container.firstChild as HTMLElement;

      expect(cardElement.className).toContain('bg-card');
      expect(cardElement.className).toContain('text-card-foreground');
      expect(cardElement.className).toContain('flex');
      expect(cardElement.className).toContain('flex-col');
      expect(cardElement.className).toContain('gap-6');
      expect(cardElement.className).toContain('rounded-xl');
      expect(cardElement.className).toContain('border');
      expect(cardElement.className).toContain('py-6');
      expect(cardElement.className).toContain('shadow-sm');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(<Card className="custom-class" />);
      const cardElement = container.firstChild as HTMLElement;

      expect(cardElement.className).toContain('bg-card');
      expect(cardElement.className).toContain('custom-class');
    });

    it('should have correct data-slot attribute', () => {
      const { container } = render(<Card />);
      const cardElement = container.firstChild as HTMLElement;

      expect(cardElement.getAttribute('data-slot')).toBe('card');
    });

    it('should pass through additional props', () => {
      const { container } = render(
        <Card id="test-card" data-testid="card-test" />
      );
      const cardElement = container.firstChild as HTMLElement;

      expect(cardElement.id).toBe('test-card');
      expect(cardElement.getAttribute('data-testid')).toBe('card-test');
    });
  });

  describe('CardHeader', () => {
    it('should render with default classes', () => {
      const { container } = render(<CardHeader />);
      const headerElement = container.firstChild as HTMLElement;

      expect(headerElement.getAttribute('data-slot')).toBe('card-header');
      expect(headerElement.className).toContain('@container/card-header');
      expect(headerElement.className).toContain('grid');
      expect(headerElement.className).toContain('auto-rows-min');
    });
  });

  describe('CardTitle', () => {
    it('should render with default classes', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const titleElement = container.firstChild as HTMLElement;

      expect(titleElement.getAttribute('data-slot')).toBe('card-title');
      expect(titleElement.className).toContain('leading-none');
      expect(titleElement.className).toContain('font-semibold');
      expect(titleElement.textContent).toBe('Title');
    });
  });

  describe('CardDescription', () => {
    it('should render with default classes', () => {
      const { container } = render(
        <CardDescription>Description</CardDescription>
      );
      const descElement = container.firstChild as HTMLElement;

      expect(descElement.getAttribute('data-slot')).toBe('card-description');
      expect(descElement.className).toContain('text-muted-foreground');
      expect(descElement.className).toContain('text-sm');
      expect(descElement.textContent).toBe('Description');
    });
  });

  describe('CardAction', () => {
    it('should render with default classes', () => {
      const { container } = render(<CardAction>Action</CardAction>);
      const actionElement = container.firstChild as HTMLElement;

      expect(actionElement.getAttribute('data-slot')).toBe('card-action');
      expect(actionElement.className).toContain('col-start-2');
      expect(actionElement.className).toContain('row-span-2');
      expect(actionElement.className).toContain('row-start-1');
      expect(actionElement.className).toContain('self-start');
      expect(actionElement.className).toContain('justify-self-end');
    });
  });

  describe('CardContent', () => {
    it('should render with default classes', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const contentElement = container.firstChild as HTMLElement;

      expect(contentElement.getAttribute('data-slot')).toBe('card-content');
      expect(contentElement.className).toContain('px-6');
      expect(contentElement.textContent).toBe('Content');
    });
  });

  describe('CardFooter', () => {
    it('should render with default classes', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footerElement = container.firstChild as HTMLElement;

      expect(footerElement.getAttribute('data-slot')).toBe('card-footer');
      expect(footerElement.className).toContain('flex');
      expect(footerElement.className).toContain('items-center');
      expect(footerElement.className).toContain('px-6');
      expect(footerElement.className).toContain('[.border-t]:pt-6');
    });
  });

  describe('Integration: Complete Card Structure', () => {
    it('should render a complete card with all subcomponents', () => {
      render(
        <Card className="custom-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <span>Footer content</span>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeTruthy();
      expect(screen.getByText('Card Description')).toBeTruthy();
      expect(screen.getByText('Action')).toBeTruthy();
      expect(screen.getByText('Card content goes here')).toBeTruthy();
      expect(screen.getByText('Footer content')).toBeTruthy();
    });

    it('should apply custom classNames to all subcomponents', () => {
      const { container } = render(
        <Card className="card-custom">
          <CardHeader className="header-custom">
            <CardTitle className="title-custom">Title</CardTitle>
            <CardDescription className="desc-custom">Desc</CardDescription>
          </CardHeader>
          <CardContent className="content-custom">Content</CardContent>
          <CardFooter className="footer-custom">Footer</CardFooter>
        </Card>
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement.className).toContain('card-custom');

      const titleElement = screen.getByText('Title');
      expect(titleElement.className).toContain('title-custom');

      const descElement = screen.getByText('Desc');
      expect(descElement.className).toContain('desc-custom');
    });
  });
});
