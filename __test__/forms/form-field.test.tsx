import { fireEvent, render, screen } from '@testing-library/react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { FormField } from '@/components/layout/form/form-field';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: jest.fn(({ render }) =>
    render({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: '',
        ref: jest.fn(),
      },
      fieldState: {},
    })
  ),
  useForm: jest.fn(() => ({
    control: {},
    trigger: jest.fn(),
  })),
}));

jest.mock('@/components/ui/input', () => ({
  Input: jest.fn(({ id, type, placeholder, onChange, onBlur, ...props }) => (
    <input
      data-testid={`input-${id}`}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  )),
}));

jest.mock('@/components/ui/label', () => ({
  Label: jest.fn(({ htmlFor, children, ...props }) => (
    <label data-testid={`label-${htmlFor}`} {...props}>
      {children}
    </label>
  )),
}));

jest.mock('@/components/ui/password-input', () => ({
  PasswordInput: jest.fn(({ id, placeholder, onChange, onBlur, ...props }) => (
    <input
      data-testid={`password-input-${id}`}
      type="password"
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  )),
}));

describe('FormField', () => {
  const mockControl = {} as Control;
  const mockTrigger = jest.fn();
  const mockOnFieldChange = jest.fn();

  const defaultProps = {
    name: 'testField',
    control: mockControl,
    label: 'Test Label',
    trigger: mockTrigger,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Controller as jest.Mock).mockImplementation(({ render }) =>
      render({
        field: {
          onChange: jest.fn(),
          onBlur: jest.fn(),
          value: '',
          ref: jest.fn(),
        },
        fieldState: {},
      })
    );
  });

  it('render label correct', () => {
    render(<FormField {...defaultProps} />);

    const label = screen.getByTestId('label-testField');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Test Label');
  });

  it('render text input by default', () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByTestId('input-testField')).toBeInTheDocument();
    expect(screen.getByTestId('input-testField')).toHaveAttribute(
      'type',
      'text'
    );
  });

  it('render email input if type is email', () => {
    render(<FormField {...defaultProps} type="email" />);

    expect(screen.getByTestId('input-testField')).toHaveAttribute(
      'type',
      'email'
    );
  });

  it('render password input if type is password', () => {
    render(<FormField {...defaultProps} type="password" />);

    expect(screen.getByTestId('password-input-testField')).toBeInTheDocument();
  });

  it('display placeholder', () => {
    render(<FormField {...defaultProps} placeholder="Enter value" />);

    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('display error message if errors provided', () => {
    const error = { message: 'This field is required' } as FieldError;

    render(<FormField {...defaultProps} errors={error} />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass(
      'text-red-600'
    );
  });

  it('call trigger and onFieldChange on input change', () => {
    render(<FormField {...defaultProps} onFieldChange={mockOnFieldChange} />);

    const input = screen.getByTestId('input-testField');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(mockTrigger).toHaveBeenCalledWith('testField');
    expect(mockOnFieldChange).toHaveBeenCalled();
  });

  it('call trigger on input blur', () => {
    render(<FormField {...defaultProps} />);

    const input = screen.getByTestId('input-testField');
    fireEvent.blur(input);

    expect(mockTrigger).toHaveBeenCalledWith('testField');
  });

  it('not call onFieldChange if not provided', () => {
    render(<FormField {...defaultProps} />);

    const input = screen.getByTestId('input-testField');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(mockTrigger).toHaveBeenCalledWith('testField');
    expect(mockOnFieldChange).not.toHaveBeenCalled();
  });

  it('pass correct props to Controller for password field', () => {
    render(<FormField {...defaultProps} type="password" />);

    const controllerCall = (Controller as jest.Mock).mock.calls[0][0];
    expect(controllerCall.name).toBe('testField');
    expect(controllerCall.control).toBe(mockControl);
    expect(typeof controllerCall.render).toBe('function');
  });

  it('pass correct props to Controller for non-password field', () => {
    render(<FormField {...defaultProps} type="email" />);

    const controllerCall = (Controller as jest.Mock).mock.calls[0][0];
    expect(controllerCall.name).toBe('testField');
    expect(controllerCall.control).toBe(mockControl);
    expect(typeof controllerCall.render).toBe('function');
  });
});
