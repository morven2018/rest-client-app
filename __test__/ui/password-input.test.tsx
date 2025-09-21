import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PasswordInput } from '@/components/ui/password-input';

jest.mock('@/lib/utils', () => {
  const originalModule = jest.requireActual('@/lib/utils');
  return {
    ...originalModule,
    cn: jest.fn((...classNames: (string | undefined | null | false)[]) =>
      classNames.filter(Boolean).join(' ')
    ),
  };
});

jest.mock('lucide-react', () => ({
  Eye: jest.fn((props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="eye-icon" {...props} />
  )),
  EyeOff: jest.fn((props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="eye-off-icon" {...props} />
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(
    ({
      children,
      onClick,
      type,
      variant,
      size,
      className,
    }: {
      children: React.ReactNode;
      onClick: () => void;
      type: 'button' | 'reset' | 'submit' | undefined;
      variant: string;
      size: string;
      className?: string;
    }) => (
      <button
        type={type}
        onClick={onClick}
        data-testid="toggle-button"
        data-variant={variant}
        data-size={size}
        className={className}
      >
        {children}
      </button>
    )
  ),
}));

const onChange = jest.fn();

const MockInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ type, className, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={className}
    data-testid="password-input"
    {...props}
  />
));
MockInput.displayName = 'MockInput';

describe('PasswordInput', () => {
  jest.mock('@/components/ui/input', () => ({
    Input: MockInput,
  }));
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render correctly with default props', () => {
    render(<PasswordInput onChange={onChange} />);

    const input =
      document.querySelector('input[data-slot="input"]') ||
      screen.getByPlaceholderText(/password/i);
    const button = screen.getByTestId('toggle-button');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveClass('pr-10');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'ghost');
    expect(button).toHaveAttribute('data-size', 'icon');

    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.getByText('Show password')).toBeInTheDocument();
  });

  it('toggle password visibility when button is clicked', () => {
    render(<PasswordInput onChange={onChange} />);

    const input =
      document.querySelector('input[data-slot="input"]') ||
      screen.getByRole('textbox', { name: '' });
    const button = screen.getByTestId('toggle-button');

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.getByText('Show password')).toBeInTheDocument();

    fireEvent.click(button);

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    expect(screen.getByText('Hide password')).toBeInTheDocument();

    fireEvent.click(button);

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.getByText('Show password')).toBeInTheDocument();
  });

  it('forward ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} onChange={onChange} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('pass additional input props correctly', () => {
    render(
      <PasswordInput
        placeholder="Enter your password"
        disabled
        className="custom-class"
        id="password-field"
        onChange={onChange}
      />
    );

    const input =
      document.querySelector('input[data-slot="input"]') ||
      screen.getByRole('textbox', { name: '' });

    expect(input).toHaveAttribute('placeholder', 'Enter your password');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('id', 'password-field');
    expect(input).toHaveClass('pr-10 custom-class');
  });

  it('merge custom className with default className', () => {
    const cnMock = jest.requireMock('@/lib/utils').cn as jest.Mock;
    cnMock.mockImplementation((...args: (string | undefined)[]) =>
      args.join(' ')
    );

    render(<PasswordInput className="my-custom-class" onChange={onChange} />);

    const input =
      document.querySelector('input[data-slot="input"]') ||
      screen.getByPlaceholderText(/password/i);
    expect(input).toHaveClass('pr-10 my-custom-class');
    expect(cnMock).toHaveBeenCalledWith('pr-10', 'my-custom-class');
  });

  it('render with correct accessibility labels', () => {
    render(<PasswordInput onChange={onChange} />);

    const button = screen.getByTestId('toggle-button');

    expect(screen.getByText('Show password')).toBeInTheDocument();
    expect(screen.getByText('Show password')).toHaveClass('sr-only');

    fireEvent.click(button);

    expect(screen.getByText('Hide password')).toBeInTheDocument();
    expect(screen.getByText('Hide password')).toHaveClass('sr-only');
  });

  it('apply correct styles to the toggle button', () => {
    render(<PasswordInput onChange={onChange} />);

    const button = screen.getByTestId('toggle-button');

    expect(button).toHaveClass('absolute');
    expect(button).toHaveClass('right-0');
    expect(button).toHaveClass('top-0');
    expect(button).toHaveClass('h-full');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('hover:bg-transparent');
  });

  it('handle multiple rapid toggles correctly', () => {
    render(<PasswordInput onChange={onChange} />);

    const input =
      document.querySelector('input[data-slot="input"]') ||
      screen.getByPlaceholderText(/password/i);
    const button = screen.getByTestId('toggle-button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('work correct with controlled value prop', () => {
    const handleChange = jest.fn();

    render(
      <PasswordInput value="controlledPassword" onChange={handleChange} />
    );

    const input =
      document.querySelector('input[data-slot="input"]') ||
      screen.getByPlaceholderText(/password/i);

    expect(input).toHaveValue('controlledPassword');

    fireEvent.change(input, { target: { value: 'newPassword' } });

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('controlledPassword');
  });

  it('handle onBlur and onFocus events', () => {
    const handleBlur = jest.fn();
    const handleFocus = jest.fn();

    render(
      <PasswordInput
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={onChange}
      />
    );

    const input =
      document.querySelector('input[data-slot="input"]') ||
      screen.getByPlaceholderText(/password/i);

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });
});
