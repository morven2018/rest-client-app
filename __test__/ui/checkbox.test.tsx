import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';

jest.mock('lucide-react', () => ({
  CheckIcon: jest.fn((props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="check-icon" {...props} />
  )),
}));

jest.mock('@radix-ui/react-checkbox', () => {
  const actual = jest.requireActual('@radix-ui/react-checkbox');
  return {
    ...actual,
    Root: jest.fn(
      ({
        className,
        children,
        checked,
        disabled,
        id,
        onChange,
        ...props
      }: React.ComponentProps<typeof actual.Root>) => (
        <button
          data-slot="checkbox"
          className={className}
          data-checked={checked}
          data-disabled={disabled}
          id={id}
          onClick={onChange}
          data-testid="checkbox-root"
          {...props}
        >
          {children}
        </button>
      )
    ),
    Indicator: jest.fn(
      ({
        className,
        children,
      }: React.ComponentProps<typeof actual.Indicator>) => (
        <span
          data-slot="checkbox-indicator"
          className={className}
          data-testid="checkbox-indicator"
        >
          {children}
        </span>
      )
    ),
  };
});

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classNames: (string | undefined)[]) =>
    classNames.filter(Boolean).join(' ')
  ),
}));

describe('Checkbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render correct with default props', () => {
    render(<Checkbox />);

    const checkbox = screen.getByTestId('checkbox-root');
    const indicator = screen.getByTestId('checkbox-indicator');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');

    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute('data-slot', 'checkbox-indicator');

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('apply custom className', () => {
    const cnMock = jest.requireMock('@/lib/utils').cn as jest.Mock;
    render(<Checkbox className="custom-class" />);

    expect(cnMock).toHaveBeenCalledWith(
      'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      'custom-class'
    );
  });

  it('pass all props to CheckboxPrimitive.Root', () => {
    const onChange = jest.fn();

    render(
      <Checkbox
        checked={true}
        disabled={true}
        onChange={onChange}
        id="test-checkbox"
      />
    );

    const checkbox = screen.getByTestId('checkbox-root');

    expect(checkbox).toHaveAttribute('data-checked', 'true');
    expect(checkbox).toHaveAttribute('data-disabled', 'true');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
  });

  it('handle click events', () => {
    const onChange = jest.fn();

    render(<Checkbox onChange={onChange} />);

    const checkbox = screen.getByTestId('checkbox-root');

    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalled();
  });

  it('render with different states', () => {
    const { rerender } = render(<Checkbox checked={true} />);
    let checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-checked', 'true');

    rerender(<Checkbox checked={false} />);
    checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-checked', 'false');

    rerender(<Checkbox disabled={true} />);
    checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-disabled', 'true');
  });

  it('show check icon when checked', () => {
    render(<Checkbox checked={true} />);

    const indicator = screen.getByTestId('checkbox-indicator');
    const checkIcon = screen.getByTestId('check-icon');

    expect(indicator).toContainElement(checkIcon);
    expect(checkIcon).toHaveClass('size-3.5');
  });

  it('handle accessibility attributes', () => {
    render(<Checkbox aria-label="Test checkbox" aria-invalid={true} />);

    const checkbox = screen.getByTestId('checkbox-root');

    expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  it('forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByTestId('checkbox-root'));
  });

  it('apply focus styles', () => {
    render(<Checkbox />);

    const checkbox = screen.getByTestId('checkbox-root');

    expect(checkbox).toHaveClass('focus-visible:ring-[3px]');
    expect(checkbox).toHaveClass('outline-none');
  });
});
