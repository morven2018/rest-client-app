import NoVariables from '@/components/layout/variables/no-variables';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

const mockUseTranslations = useTranslations as jest.Mock;
const mockOnAddVariable = jest.fn();

describe('NoVariables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslations.mockReturnValue((key: string) => {
      const translations: Record<string, string> = {
        'no-variable': 'No variables found',
        'add-variable': 'Add Variable',
      };
      return translations[key];
    });
  });

  it('render correct with translated text', () => {
    render(<NoVariables onAddVariable={mockOnAddVariable} />);

    expect(screen.getByText('No variables found')).toBeInTheDocument();
    expect(screen.getByText('Add Variable')).toBeInTheDocument();
  });

  it('call onAddVariable on button click', () => {
    render(<NoVariables onAddVariable={mockOnAddVariable} />);

    const button = screen.getByRole('button', { name: 'Add Variable' });
    fireEvent.click(button);

    expect(mockOnAddVariable).toHaveBeenCalledTimes(1);
  });

  it('have correct styling classes', () => {
    render(<NoVariables onAddVariable={mockOnAddVariable} />);

    const container = screen.getByText('No variables found').parentElement;
    const button = screen.getByRole('button');

    expect(container).toHaveClass('text-center', 'py-8');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'mx-auto',
      'h-12',
      'bg-violet-800',
      'hover:bg-violet-900',
      'dark:bg-neutral-50',
      'text-white',
      'dark:text-violet-800',
      'dark:hover:bg-violet-200',
      'text-xl',
      'px-9',
      'py-2'
    );
  });

  it('use useTranslations with correct namespace', () => {
    render(<NoVariables onAddVariable={mockOnAddVariable} />);

    expect(mockUseTranslations).toHaveBeenCalledWith('variables');
  });
});
