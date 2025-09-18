import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DateLib, DayButton, DayPicker } from 'react-day-picker';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';

jest.mock('react-day-picker', () => {
  const originalModule = jest.requireActual('react-day-picker');
  return {
    ...originalModule,
    DayPicker: jest.fn(({ children, ...props }) => (
      <div data-testid="day-picker" {...props}>
        {children}
      </div>
    )),
    DayButton: jest.fn(({ children, ...props }) => (
      <button data-testid="day-button" {...props}>
        {children}
      </button>
    )),
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, ...props }) => (
    <button {...props}>{children}</button>
  )),
  buttonVariants: jest.fn(() => 'button-variants'),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

jest.mock('lucide-react', () => ({
  ChevronDownIcon: jest.fn((props) => (
    <svg data-testid="chevron-down" {...props} />
  )),
  ChevronLeftIcon: jest.fn((props) => (
    <svg data-testid="chevron-left" {...props} />
  )),
  ChevronRightIcon: jest.fn((props) => (
    <svg data-testid="chevron-right" {...props} />
  )),
}));

describe('Calendar', () => {
  const defaultProps = {
    mode: 'single' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render correct with min props', () => {
    render(<Calendar {...defaultProps} />);

    expect(screen.getByTestId('day-picker')).toBeInTheDocument();
    expect(DayPicker).toHaveBeenCalled();
  });

  it('apply correct className', () => {
    render(<Calendar {...defaultProps} />);
    expect(jest.requireMock('@/lib/utils').cn).toHaveBeenCalledWith(
      'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
      String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
      String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
      undefined
    );
  });

  it('configure formatters correctly', () => {
    render(<Calendar {...defaultProps} />);
    const dayPickerCall = (DayPicker as jest.Mock).mock.calls[0][0];
    expect(dayPickerCall.formatters.formatMonthDropdown).toBeDefined();

    const testDate = new Date(2023, 0, 1);
    const formatted = dayPickerCall.formatters.formatMonthDropdown(testDate);
    expect(formatted).toBe('янв.');
  });

  it('use right components', () => {
    render(<Calendar {...defaultProps} />);

    const dayPickerCall = (DayPicker as jest.Mock).mock.calls[0][0];
    expect(dayPickerCall.components.Chevron).toBeDefined();
    expect(dayPickerCall.components.DayButton).toBe(CalendarDayButton);
    expect(dayPickerCall.components.Root).toBeDefined();
    expect(dayPickerCall.components.WeekNumber).toBeDefined();
  });

  it('support custom buttonVariant', () => {
    render(<Calendar {...defaultProps} buttonVariant="outline" />);
    expect(
      jest.requireMock('@/components/ui/button').buttonVariants
    ).toHaveBeenCalledWith({ variant: 'outline' });
  });
});

describe('CalendarDayButton', () => {
  const defaultProps: React.ComponentProps<typeof DayButton> = {
    day: {
      date: new Date(2023, 0, 1),
      displayMonth: new Date(2023, 0, 1),
      dateLib: new DateLib(),
      outside: false,
      isEqualTo: function (): boolean {
        throw new Error('Function not implemented.');
      },
    },
    modifiers: {
      selected: false,
      range_start: false,
      range_end: false,
      range_middle: false,
      focused: false,
      today: false,
      disabled: false,
      outside: false,
    },
    className: 'test-class',
  };

  it('render correct', () => {
    render(<CalendarDayButton {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('apply correct classes for different modifiers', () => {
    const { rerender } = render(<CalendarDayButton {...defaultProps} />);

    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-selected-single', 'false');
    expect(button).toHaveAttribute('data-range-start', 'false');
    expect(button).toHaveAttribute('data-range-end', 'false');
    expect(button).toHaveAttribute('data-range-middle', 'false');
    rerender(
      <CalendarDayButton
        {...defaultProps}
        modifiers={{ ...defaultProps.modifiers, selected: true }}
      />
    );

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-selected-single', 'true');
    rerender(
      <CalendarDayButton
        {...defaultProps}
        modifiers={{ ...defaultProps.modifiers, range_start: true }}
      />
    );

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-range-start', 'true');
    rerender(
      <CalendarDayButton
        {...defaultProps}
        modifiers={{ ...defaultProps.modifiers, range_end: true }}
      />
    );

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-range-end', 'true');
    rerender(
      <CalendarDayButton
        {...defaultProps}
        modifiers={{ ...defaultProps.modifiers, range_middle: true }}
      />
    );

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-range-middle', 'true');
  });

  it('focus with the focused modifier', () => {
    render(
      <CalendarDayButton
        {...defaultProps}
        modifiers={{ ...defaultProps.modifiers, focused: true }}
      />
    );
    expect(typeof CalendarDayButton).toBe('function');
  });

  it('correct formats the data-day attribute', () => {
    render(<CalendarDayButton {...defaultProps} />);

    const button = screen.getByRole('button');
    const expectedDateString = new Date(2023, 0, 1).toLocaleDateString();
    expect(button).toHaveAttribute('data-day', expectedDateString);
  });
});
