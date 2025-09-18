import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge, badgeVariants } from '@/components/ui/badge';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('class-variance-authority', () => ({
  cva: jest.fn(() => {
    return jest.fn((props: { variant?: string }) => {
      const baseClasses =
        'inline-flex items-center justify-center rounded-lg border-transparent text-white border px-4 py-0.5';
      const variantClasses = {
        default: 'bg-gray-400',
        ok: 'bg-teal-600',
        error: 'bg-red-600',
        info: 'bg-indigo-600',
      };
      return `${baseClasses} ${variantClasses[props?.variant as keyof typeof variantClasses] || variantClasses.default}`;
    });
  }),
}));

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span className={className} data-testid="slot-component" {...props}>
      {children}
    </span>
  ),
}));

jest.mock('lucide-react', () => ({
  Loader: () => <svg data-testid="loader-icon" className="size-4" />,
}));

describe('Badge Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without throwing errors', () => {
      expect(() => render(<Badge>Test Badge</Badge>)).not.toThrow();
    });

    it('should render children content', () => {
      render(<Badge>Test Content</Badge>);
      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('should have correct data-slot attribute', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badgeElement = container.querySelector('[data-slot="badge"]');
      expect(badgeElement).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('should apply default variant classes when no variant is provided', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badgeElement = container.firstChild as HTMLElement;

      expect(badgeElement.className).toContain('bg-gray-400');
      expect(badgeElement.className).toContain('inline-flex');
      expect(badgeElement.className).toContain('items-center');
      expect(badgeElement.className).toContain('justify-center');
    });

    it('should apply ok variant classes', () => {
      const { container } = render(<Badge variant="ok">OK</Badge>);
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement.className).toContain('bg-teal-600');
    });

    it('should apply error variant classes', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement.className).toContain('bg-red-600');
    });

    it('should apply info variant classes', () => {
      const { container } = render(<Badge variant="info">Info</Badge>);
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement.className).toContain('bg-indigo-600');
    });
  });

  describe('Loader Icon', () => {
    it('should render Loader icon when variant is info', () => {
      render(<Badge variant="info">Info Badge</Badge>);
      const loaderIcon = screen.getByTestId('loader-icon');
      expect(loaderIcon).toBeTruthy();
    });

    it('should not render Loader icon for other variants', () => {
      render(<Badge variant="ok">OK Badge</Badge>);
      const loaderIcon = screen.queryByTestId('loader-icon');
      expect(loaderIcon).toBeNull();
    });

    it('should not render Loader icon for default variant', () => {
      render(<Badge>Default Badge</Badge>);
      const loaderIcon = screen.queryByTestId('loader-icon');
      expect(loaderIcon).toBeNull();
    });

    it('should render both Loader icon and children for info variant', () => {
      render(<Badge variant="info">Loading</Badge>);

      const loaderIcon = screen.getByTestId('loader-icon');
      const textContent = screen.getByText('Loading');

      expect(loaderIcon).toBeTruthy();
      expect(textContent).toBeTruthy();
    });
  });

  describe('asChild Prop', () => {
    it('should render as span by default', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement.tagName).toBe('SPAN');
    });

    it('should render as Slot component when asChild is true', () => {
      const { getByTestId } = render(<Badge asChild>Test</Badge>);
      const slotComponent = getByTestId('slot-component');
      expect(slotComponent).toBeTruthy();
    });

    it('should pass className to Slot component when asChild is true', () => {
      const { getByTestId } = render(
        <Badge asChild className="custom-class">
          Test
        </Badge>
      );
      const slotComponent = getByTestId('slot-component');
      expect(slotComponent.className).toContain('custom-class');
    });
  });

  describe('ClassName Merging', () => {
    it('should merge custom className with variant classes', () => {
      const { container } = render(
        <Badge variant="ok" className="custom-class">
          Test
        </Badge>
      );
      const badgeElement = container.firstChild as HTMLElement;

      expect(badgeElement.className).toContain('bg-teal-600');
      expect(badgeElement.className).toContain('custom-class');
    });

    it('should handle undefined className', () => {
      const { container } = render(
        <Badge variant="ok" className={undefined}>
          Test
        </Badge>
      );
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement.className).toContain('bg-teal-600');
    });

    it('should handle empty string className', () => {
      const { container } = render(
        <Badge variant="ok" className="">
          Test
        </Badge>
      );
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement.className).toContain('bg-teal-600');
    });
  });

  describe('Prop Passing', () => {
    it('should pass through additional props to the element', () => {
      const { container } = render(
        <Badge id="test-badge" data-test="badge-test" title="Badge Title">
          Test
        </Badge>
      );
      const badgeElement = container.firstChild as HTMLElement;

      expect(badgeElement.id).toBe('test-badge');
      expect(badgeElement.getAttribute('data-test')).toBe('badge-test');
      expect(badgeElement.getAttribute('title')).toBe('Badge Title');
    });

    it('should pass through additional props to Slot when asChild is true', () => {
      const { getByTestId } = render(
        <Badge asChild id="test-badge" data-test="badge-test">
          Test
        </Badge>
      );
      const slotComponent = getByTestId('slot-component');

      expect(slotComponent.id).toBe('test-badge');
      expect(slotComponent.getAttribute('data-test')).toBe('badge-test');
    });
  });

  describe('Base Styles', () => {
    it('should always apply base styles regardless of variant', () => {
      const variants = ['default', 'ok', 'error', 'info'] as const;

      variants.forEach((variant) => {
        const { container } = render(<Badge variant={variant}>Test</Badge>);
        const badgeElement = container.firstChild as HTMLElement;

        expect(badgeElement.className).toContain('inline-flex');
        expect(badgeElement.className).toContain('items-center');
        expect(badgeElement.className).toContain('justify-center');
        expect(badgeElement.className).toContain('rounded-lg');
        expect(badgeElement.className).toContain('border-transparent');
        expect(badgeElement.className).toContain('text-white');
        expect(badgeElement.className).toContain('border');
        expect(badgeElement.className).toContain('px-4');
        expect(badgeElement.className).toContain('py-0.5');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should render without children', () => {
      const { container } = render(<Badge />);
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement).toBeTruthy();
    });

    it('should render with empty string children', () => {
      const { container } = render(<Badge>{''}</Badge>);
      const badgeElement = container.firstChild as HTMLElement;
      expect(badgeElement).toBeTruthy();
    });

    it('should render with React node children', () => {
      render(
        <Badge>
          <span data-testid="child-element">Child</span>
        </Badge>
      );

      const childElement = screen.getByTestId('child-element');
      expect(childElement).toBeTruthy();
      expect(childElement.textContent).toBe('Child');
    });
  });
});

describe('Badge Component Snapshot', () => {
  it('default variant should match snapshot', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('info variant should match snapshot', () => {
    const { container } = render(<Badge variant="info">Loading</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('with custom className should match snapshot', () => {
    const { container } = render(<Badge className="mt-4">Custom</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('asChild should match snapshot', () => {
    const { container } = render(<Badge asChild>Slot</Badge>);
    expect(container).toMatchSnapshot();
  });
});

describe('badgeVariants', () => {
  it('should return base classes for default variant', () => {
    const result = badgeVariants({ variant: 'default' });
    expect(result).toContain('bg-gray-400');
    expect(result).toContain('inline-flex');
  });

  it('should return correct classes for ok variant', () => {
    const result = badgeVariants({ variant: 'ok' });
    expect(result).toContain('bg-teal-600');
  });

  it('should return correct classes for error variant', () => {
    const result = badgeVariants({ variant: 'error' });
    expect(result).toContain('bg-red-600');
  });

  it('should return correct classes for info variant', () => {
    const result = badgeVariants({ variant: 'info' });
    expect(result).toContain('bg-indigo-600');
  });
});
