import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@radix-ui/react-label', () => ({
  Root: ({
    className,
    children,
    htmlFor,
    ...props
  }: {
    className?: string;
    children: React.ReactNode;
    htmlFor?: string;
  }) => (
    <label
      className={className}
      htmlFor={htmlFor}
      data-testid="label-root"
      {...props}
    >
      {children}
    </label>
  ),
}));

describe('Label Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without throwing errors', () => {
    expect(() => render(<Label>Test Label</Label>)).not.toThrow();
  });

  it('should render children content', () => {
    render(<Label>Test Label Content</Label>);
    expect(screen.getByText('Test Label Content')).toBeTruthy();
  });

  it('should have correct data-slot attribute', () => {
    const { getByTestId } = render(<Label>Test</Label>);
    const labelElement = getByTestId('label-root');
    expect(labelElement.getAttribute('data-slot')).toBe('label');
  });

  it('should apply default className styles', () => {
    const { getByTestId } = render(<Label>Test</Label>);
    const labelElement = getByTestId('label-root');

    expect(labelElement.className).toContain('flex');
    expect(labelElement.className).toContain('items-center');
    expect(labelElement.className).toContain('gap-2');
    expect(labelElement.className).toContain('text-sm');
    expect(labelElement.className).toContain('leading-none');
    expect(labelElement.className).toContain('font-medium');
    expect(labelElement.className).toContain('select-none');
  });

  it('should merge custom className with default classes', () => {
    const { getByTestId } = render(
      <Label className="custom-class mb-4">Test</Label>
    );
    const labelElement = getByTestId('label-root');

    expect(labelElement.className).toContain('flex');
    expect(labelElement.className).toContain('text-sm');
    expect(labelElement.className).toContain('custom-class');
    expect(labelElement.className).toContain('mb-4');
  });

  it('should pass through additional props to the underlying label element', () => {
    const { getByTestId } = render(
      <Label
        id="test-label"
        htmlFor="input-field"
        data-test="label-test"
        title="Label title"
      >
        Test Label
      </Label>
    );

    const labelElement = getByTestId('label-root');

    expect(labelElement.id).toBe('test-label');
    expect(labelElement.getAttribute('data-test')).toBe('label-test');
    expect(labelElement.getAttribute('title')).toBe('Label title');
  });

  it('should handle undefined className gracefully', () => {
    const { getByTestId } = render(<Label className={undefined}>Test</Label>);
    const labelElement = getByTestId('label-root');

    expect(labelElement.className).toContain('flex');
    expect(labelElement.className).toContain('text-sm');
  });

  it('should handle empty string className', () => {
    const { getByTestId } = render(<Label className="">Test</Label>);
    const labelElement = getByTestId('label-root');

    expect(labelElement.className).toContain('flex');
    expect(labelElement.className).toContain('text-sm');
  });

  it('should render with React node children', () => {
    render(
      <Label>
        <span data-testid="child-element">Label with icon</span>
        <svg data-testid="icon" />
      </Label>
    );

    const childElement = screen.getByTestId('child-element');
    const iconElement = screen.getByTestId('icon');

    expect(childElement).toBeTruthy();
    expect(childElement.textContent).toBe('Label with icon');
    expect(iconElement).toBeTruthy();
  });

  it('should support accessibility attributes', () => {
    const { getByTestId } = render(
      <Label htmlFor="username-input" aria-describedby="username-help">
        Username
      </Label>
    );

    const labelElement = getByTestId('label-root');
    expect(labelElement.getAttribute('aria-describedby')).toBe('username-help');
  });

  describe('Edge Cases', () => {
    it('should render with empty children', () => {
      const { getByTestId } = render(<Label>{''}</Label>);
      const labelElement = getByTestId('label-root');
      expect(labelElement).toBeTruthy();
    });

    it('should render with no children', () => {
      const { getByTestId } = render(<Label />);
      const labelElement = getByTestId('label-root');
      expect(labelElement).toBeTruthy();
    });

    it('should render with number children', () => {
      render(<Label>{42}</Label>);
      expect(screen.getByText('42')).toBeTruthy();
    });

    it('should render with multiple children', () => {
      render(
        <Label>
          <span>First</span>
          <span>Second</span>
        </Label>
      );

      expect(screen.getByText('First')).toBeTruthy();
      expect(screen.getByText('Second')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should maintain flex layout with gap', () => {
      const { getByTestId } = render(<Label>Test</Label>);
      const labelElement = getByTestId('label-root');

      expect(labelElement.className).toContain('flex');
      expect(labelElement.className).toContain('items-center');
      expect(labelElement.className).toContain('gap-2');
    });
  });
});

describe('Label Component Snapshot', () => {
  it('should match snapshot with text content', () => {
    const { container } = render(<Label>Test Label</Label>);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with custom className', () => {
    const { container } = render(
      <Label className="text-blue-500">Blue Label</Label>
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with additional props', () => {
    const { container } = render(
      <Label htmlFor="input" id="label-1" data-test="label">
        Input Label
      </Label>
    );
    expect(container).toMatchSnapshot();
  });
});
