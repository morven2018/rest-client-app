import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from '@/components/ui/popover';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@radix-ui/react-popover', () => {
  const originalModule = jest.requireActual('@radix-ui/react-popover');
  return {
    ...originalModule,
    Root: ({
      children,
      'data-slot': dataSlot,
      ...props
    }: {
      children: React.ReactNode;
      'data-slot'?: string;
    }) => (
      <div data-slot={dataSlot} data-testid="popover-root" {...props}>
        {children}
      </div>
    ),
    Trigger: ({
      children,
      'data-slot': dataSlot,
      ...props
    }: {
      children: React.ReactNode;
      'data-slot'?: string;
    }) => (
      <button data-slot={dataSlot} data-testid="popover-trigger" {...props}>
        {children}
      </button>
    ),
    Content: ({
      className,
      children,
      'data-slot': dataSlot,
      align = 'center',
      sideOffset = 4,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
      'data-slot'?: string;
      align?: string;
      sideOffset?: number;
    }) => (
      <div
        className={className}
        data-slot={dataSlot}
        data-testid="popover-content"
        data-align={align}
        data-side-offset={sideOffset}
        {...props}
      >
        {children}
      </div>
    ),
    Anchor: ({
      children,
      'data-slot': dataSlot,
      ...props
    }: {
      children: React.ReactNode;
      'data-slot'?: string;
    }) => (
      <div data-slot={dataSlot} data-testid="popover-anchor" {...props}>
        {children}
      </div>
    ),
    Portal: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="popover-portal">{children}</div>
    ),
  };
});

describe('Popover Components', () => {
  describe('Popover', () => {
    it('should render without throwing errors', () => {
      expect(() => render(<Popover>Test</Popover>)).not.toThrow();
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(<Popover>Test</Popover>);
      const popoverRoot = getByTestId('popover-root');

      expect(popoverRoot.getAttribute('data-slot')).toBe('popover');
    });

    it('should pass through additional props', () => {
      const { getByTestId } = render(
        <Popover data-test="popover-test">Test</Popover>
      );
      const popoverRoot = getByTestId('popover-root');
      expect(popoverRoot.getAttribute('data-test')).toBe('popover-test');
    });

    it('should render children', () => {
      const { getByText } = render(<Popover>Test Content</Popover>);
      expect(getByText('Test Content')).toBeTruthy();
    });
  });

  describe('PopoverTrigger', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(<PopoverTrigger>Trigger</PopoverTrigger>)
      ).not.toThrow();
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(<PopoverTrigger>Trigger</PopoverTrigger>);
      const popoverTrigger = getByTestId('popover-trigger');

      expect(popoverTrigger.getAttribute('data-slot')).toBe('popover-trigger');
    });

    it('should render as a button element', () => {
      const { getByTestId } = render(<PopoverTrigger>Trigger</PopoverTrigger>);
      const popoverTrigger = getByTestId('popover-trigger');

      expect(popoverTrigger.tagName).toBe('BUTTON');
    });

    it('should render children content', () => {
      const { getByText } = render(<PopoverTrigger>Click Me</PopoverTrigger>);
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should pass through additional props', () => {
      const { getByTestId } = render(
        <PopoverTrigger id="test-trigger" data-test="trigger-test">
          Trigger
        </PopoverTrigger>
      );
      const popoverTrigger = getByTestId('popover-trigger');

      expect(popoverTrigger.id).toBe('test-trigger');
      expect(popoverTrigger.getAttribute('data-test')).toBe('trigger-test');
    });
  });

  describe('PopoverContent', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(<PopoverContent>Content</PopoverContent>)
      ).not.toThrow();
    });

    it('should apply default className', () => {
      const { getByTestId } = render(<PopoverContent>Content</PopoverContent>);
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.className).toContain('bg-popover');
      expect(popoverContent.className).toContain('text-popover-foreground');
    });

    it('should merge custom className with default classes', () => {
      const { getByTestId } = render(
        <PopoverContent className="custom-class">Content</PopoverContent>
      );
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.className).toContain('bg-popover');
      expect(popoverContent.className).toContain('custom-class');
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(<PopoverContent>Content</PopoverContent>);
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.getAttribute('data-slot')).toBe('popover-content');
    });

    it('should have default align and sideOffset values', () => {
      const { getByTestId } = render(<PopoverContent>Content</PopoverContent>);
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.getAttribute('data-align')).toBe('center');
      expect(popoverContent.getAttribute('data-side-offset')).toBe('4');
    });

    it('should accept custom align and sideOffset values', () => {
      const { getByTestId } = render(
        <PopoverContent align="start" sideOffset={8}>
          Content
        </PopoverContent>
      );
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.getAttribute('data-align')).toBe('start');
      expect(popoverContent.getAttribute('data-side-offset')).toBe('8');
    });

    it('should render children content', () => {
      const { getByText } = render(
        <PopoverContent>Popover Content</PopoverContent>
      );
      expect(getByText('Popover Content')).toBeTruthy();
    });

    it('should pass through additional props', () => {
      const { getByTestId } = render(
        <PopoverContent id="test-content" data-test="content-test">
          Content
        </PopoverContent>
      );
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.id).toBe('test-content');
      expect(popoverContent.getAttribute('data-test')).toBe('content-test');
    });
  });

  describe('PopoverAnchor', () => {
    it('should render without throwing errors', () => {
      expect(() => render(<PopoverAnchor>Anchor</PopoverAnchor>)).not.toThrow();
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(<PopoverAnchor>Anchor</PopoverAnchor>);
      const popoverAnchor = getByTestId('popover-anchor');

      expect(popoverAnchor.getAttribute('data-slot')).toBe('popover-anchor');
    });

    it('should render children content', () => {
      const { getByText } = render(<PopoverAnchor>Anchor Point</PopoverAnchor>);
      expect(getByText('Anchor Point')).toBeTruthy();
    });

    it('should pass through additional props', () => {
      const { getByTestId } = render(
        <PopoverAnchor id="test-anchor" data-test="anchor-test">
          Anchor
        </PopoverAnchor>
      );
      const popoverAnchor = getByTestId('popover-anchor');

      expect(popoverAnchor.id).toBe('test-anchor');
      expect(popoverAnchor.getAttribute('data-test')).toBe('anchor-test');
    });
  });

  describe('Integration: Complete Popover Structure', () => {
    it('should render a complete popover with all components', () => {
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>
            <div>Popover Content</div>
          </PopoverContent>
          <PopoverAnchor>Anchor</PopoverAnchor>
        </Popover>
      );

      expect(screen.getByText('Open Popover')).toBeTruthy();
      expect(screen.getByText('Popover Content')).toBeTruthy();
      expect(screen.getByText('Anchor')).toBeTruthy();
    });

    it('should apply custom classNames to all components', () => {
      const { getByTestId } = render(
        <Popover data-testid="popover-test">
          <PopoverTrigger className="trigger-custom">Trigger</PopoverTrigger>
          <PopoverContent className="content-custom">Content</PopoverContent>
          <PopoverAnchor className="anchor-custom">Anchor</PopoverAnchor>
        </Popover>
      );

      const popoverTrigger = getByTestId('popover-trigger');
      const popoverContent = getByTestId('popover-content');
      const popoverAnchor = getByTestId('popover-anchor');

      expect(popoverTrigger.className).toContain('trigger-custom');
      expect(popoverContent.className).toContain('content-custom');
      expect(popoverAnchor.className).toContain('anchor-custom');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined className gracefully in PopoverContent', () => {
      const { getByTestId } = render(
        <PopoverContent className={undefined}>Content</PopoverContent>
      );
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.className).toContain('bg-popover');
    });

    it('should handle empty string className', () => {
      const { getByTestId } = render(
        <PopoverContent className="">Content</PopoverContent>
      );
      const popoverContent = getByTestId('popover-content');

      expect(popoverContent.className).toContain('bg-popover');
    });
  });
});

describe('Popover Components Snapshot', () => {
  it('Popover should match snapshot', () => {
    const { container } = render(<Popover>Test</Popover>);
    expect(container).toMatchSnapshot();
  });

  it('PopoverTrigger should match snapshot', () => {
    const { container } = render(<PopoverTrigger>Trigger</PopoverTrigger>);
    expect(container).toMatchSnapshot();
  });

  it('PopoverContent should match snapshot', () => {
    const { container } = render(<PopoverContent>Content</PopoverContent>);
    expect(container).toMatchSnapshot();
  });

  it('PopoverAnchor should match snapshot', () => {
    const { container } = render(<PopoverAnchor>Anchor</PopoverAnchor>);
    expect(container).toMatchSnapshot();
  });

  it('Complete Popover should match snapshot', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
        <PopoverAnchor>Anchor</PopoverAnchor>
      </Popover>
    );
    expect(container).toMatchSnapshot();
  });
});
