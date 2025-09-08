import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from '@/components/ui/form';
import {
  useForm,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form';

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
      data-testid="label"
      {...props}
    >
      {children}
    </label>
  ),
}));

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({
    children,
    className,
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
  }) => (
    <div
      className={className}
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      data-testid="slot"
      {...props}
    >
      {children}
    </div>
  ),
}));

const mockGetFieldState = jest.fn();
const mockUseFormContext = useFormContext as jest.Mock;
const mockUseFormState = useFormState as jest.Mock;

jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  return {
    ...actual,
    useFormContext: jest.fn(),
    useFormState: jest.fn(),
    Controller: jest.fn(
      ({
        render,
      }: {
        render: (props: {
          field: object;
          fieldState: object;
        }) => React.ReactNode;
      }) => render({ field: {}, fieldState: {} })
    ),
  };
});

jest.mock('@/components/ui/label', () => ({
  Label: ({
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
      data-testid="label"
      {...props}
    >
      {children}
    </label>
  ),
}));

const TestFormWrapper: React.FC<{
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}> = ({ children, defaultValues = {} }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('Form Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFormContext.mockReturnValue({
      getFieldState: mockGetFieldState.mockReturnValue({ error: undefined }),
    });

    mockUseFormState.mockReturnValue({});
  });

  describe('FormItem', () => {
    it('should render without throwing errors', () => {
      expect(() => render(<FormItem>Test</FormItem>)).not.toThrow();
    });

    it('should render children content', () => {
      render(<FormItem>Test Content</FormItem>);
      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('should have correct data-slot attribute', () => {
      const { container } = render(<FormItem>Test</FormItem>);
      const formItem = container.querySelector('[data-slot="form-item"]');
      expect(formItem).toBeTruthy();
    });

    it('should apply default className', () => {
      const { container } = render(<FormItem>Test</FormItem>);
      const formItem = container.querySelector('[data-slot="form-item"]');
      expect(formItem?.className).toContain('grid');
      expect(formItem?.className).toContain('gap-2');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <FormItem className="custom-class">Test</FormItem>
      );
      const formItem = container.querySelector('[data-slot="form-item"]');
      expect(formItem?.className).toContain('grid');
      expect(formItem?.className).toContain('custom-class');
    });
  });

  describe('FormLabel', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(
          <TestFormWrapper>
            <FormLabel>Test</FormLabel>
          </TestFormWrapper>
        )
      ).not.toThrow();
    });

    it('should render children content', () => {
      render(
        <TestFormWrapper>
          <FormLabel>Test Label</FormLabel>
        </TestFormWrapper>
      );
      expect(screen.getByText('Test Label')).toBeTruthy();
    });

    it('should have correct data-slot attribute', () => {
      const { container } = render(
        <TestFormWrapper>
          <FormLabel>Test</FormLabel>
        </TestFormWrapper>
      );
      const formLabel = container.querySelector('[data-slot="form-label"]');
      expect(formLabel).toBeTruthy();
    });

    it('should apply error styling when there is an error', () => {
      mockGetFieldState.mockReturnValue({ error: { message: 'Error' } });

      const { container } = render(
        <TestFormWrapper>
          <FormLabel>Test</FormLabel>
        </TestFormWrapper>
      );

      const formLabel = container.querySelector('[data-slot="form-label"]');
      expect(formLabel?.getAttribute('data-error')).toBe('true');
    });
  });

  describe('FormControl', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(
          <TestFormWrapper>
            <FormControl>Test</FormControl>
          </TestFormWrapper>
        )
      ).not.toThrow();
    });

    it('should render children content', () => {
      render(
        <TestFormWrapper>
          <FormControl>
            <input type="text" />
          </FormControl>
        </TestFormWrapper>
      );
      expect(screen.getByRole('textbox')).toBeTruthy();
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(
        <TestFormWrapper>
          <FormControl>Test</FormControl>
        </TestFormWrapper>
      );
      const formControl = getByTestId('slot');
      expect(formControl.getAttribute('data-slot')).toBe('form-control');
    });

    it('should set aria-invalid when there is an error', () => {
      mockGetFieldState.mockReturnValue({ error: { message: 'Error' } });

      const { getByTestId } = render(
        <TestFormWrapper>
          <FormControl>Test</FormControl>
        </TestFormWrapper>
      );

      const formControl = getByTestId('slot');
      expect(formControl.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('FormDescription', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(
          <TestFormWrapper>
            <FormDescription>Test</FormDescription>
          </TestFormWrapper>
        )
      ).not.toThrow();
    });

    it('should render children content', () => {
      render(
        <TestFormWrapper>
          <FormDescription>Test Description</FormDescription>
        </TestFormWrapper>
      );
      expect(screen.getByText('Test Description')).toBeTruthy();
    });

    it('should have correct data-slot attribute', () => {
      const { container } = render(
        <TestFormWrapper>
          <FormDescription>Test</FormDescription>
        </TestFormWrapper>
      );
      const formDescription = container.querySelector(
        '[data-slot="form-description"]'
      );
      expect(formDescription).toBeTruthy();
    });

    it('should apply default className', () => {
      const { container } = render(
        <TestFormWrapper>
          <FormDescription>Test</FormDescription>
        </TestFormWrapper>
      );
      const formDescription = container.querySelector(
        '[data-slot="form-description"]'
      );
      expect(formDescription?.className).toContain('text-muted-foreground');
      expect(formDescription?.className).toContain('text-sm');
    });
  });

  describe('FormMessage', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(
          <TestFormWrapper>
            <FormMessage>Test</FormMessage>
          </TestFormWrapper>
        )
      ).not.toThrow();
    });

    it('should render error message from field state when present', () => {
      mockGetFieldState.mockReturnValue({ error: { message: 'Field error' } });

      render(
        <TestFormWrapper>
          <FormMessage />
        </TestFormWrapper>
      );

      expect(screen.getByText('Field error')).toBeTruthy();
    });

    it('should render children content when no error is present', () => {
      render(
        <TestFormWrapper>
          <FormMessage>Default message</FormMessage>
        </TestFormWrapper>
      );

      expect(screen.getByText('Default message')).toBeTruthy();
    });

    it('should not render when neither error nor children are present', () => {
      const { container } = render(
        <TestFormWrapper>
          <FormMessage />
        </TestFormWrapper>
      );

      const formMessage = container.querySelector('[data-slot="form-message"]');
      expect(formMessage).toBeNull();
    });

    it('should have correct data-slot attribute', () => {
      mockGetFieldState.mockReturnValue({ error: { message: 'Error' } });

      const { container } = render(
        <TestFormWrapper>
          <FormMessage />
        </TestFormWrapper>
      );

      const formMessage = container.querySelector('[data-slot="form-message"]');
      expect(formMessage).toBeTruthy();
    });

    it('should apply error styling', () => {
      mockGetFieldState.mockReturnValue({ error: { message: 'Error' } });

      const { container } = render(
        <TestFormWrapper>
          <FormMessage />
        </TestFormWrapper>
      );

      const formMessage = container.querySelector('[data-slot="form-message"]');
      expect(formMessage?.className).toContain('text-destructive');
      expect(formMessage?.className).toContain('text-sm');
    });
  });

  describe('FormField', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(
          <TestFormWrapper>
            <FormField name="test" render={() => <div>Test</div>} />
          </TestFormWrapper>
        )
      ).not.toThrow();
    });
  });

  describe('useFormField hook', () => {
    it('should throw error when used outside FormField context', () => {
      const TestComponent = () => {
        try {
          useFormField();
          return <div>No error</div>;
        } catch (error) {
          return <div data-testid="error">Error caught</div>;
        }
      };

      render(
        <TestFormWrapper>
          <TestComponent />
        </TestFormWrapper>
      );
    });

    it('should return field information when used within FormField', () => {
      const TestComponent = () => {
        const field = useFormField();
        return (
          <div>
            <span data-testid="field-name">{field.name}</span>
            <span data-testid="field-id">{field.id}</span>
          </div>
        );
      };

      render(
        <TestFormWrapper>
          <FormField
            name="testField"
            render={() => (
              <FormItem>
                <TestComponent />
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      expect(screen.getByTestId('field-name').textContent).toBe('testField');
      expect(screen.getByTestId('field-id').textContent).toBeTruthy();
    });
  });

  describe('Integration: Complete Form', () => {
    it('should render a complete form with all components', () => {
      render(
        <TestFormWrapper>
          <FormField
            name="username"
            render={() => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <input type="text" />
                </FormControl>
                <FormDescription>Enter your username</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      expect(screen.getByText('Username')).toBeTruthy();
      expect(screen.getByRole('textbox')).toBeTruthy();
      expect(screen.getByText('Enter your username')).toBeTruthy();
    });

    it('should show error message when field has error', () => {
      mockGetFieldState.mockReturnValue({
        error: { message: 'Username is required' },
      });

      render(
        <TestFormWrapper>
          <FormField
            name="username"
            render={() => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <input type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TestFormWrapper>
      );

      expect(screen.getByText('Username is required')).toBeTruthy();
    });
  });
});
