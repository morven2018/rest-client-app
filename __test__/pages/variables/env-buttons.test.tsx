import EnvButtons from '@/components/layout/variables/env-buttons';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => {
    const t = (key: string): string => {
      const translations: Record<string, string> = {
        'add-variable': 'Add Variable',
        remove: 'Remove Selected',
      };
      return translations[key] || key;
    };

    t.rich = jest.fn();
    t.markup = jest.fn();
    t.raw = jest.fn();
    t.has = jest.fn();

    return t;
  }),
}));

describe('EnvButtons', () => {
  const mockOnAddVariable = jest.fn();
  const mockOnRemoveSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render add variable button', () => {
    render(
      <EnvButtons
        selectedCount={0}
        onAddVariable={mockOnAddVariable}
        onRemoveSelected={mockOnRemoveSelected}
      />
    );

    const addButton = screen.getByText('Add Variable');
    expect(addButton).toBeInTheDocument();
  });

  it('call onAddVariable on Add button click', async () => {
    const user = userEvent.setup();
    render(
      <EnvButtons
        selectedCount={0}
        onAddVariable={mockOnAddVariable}
        onRemoveSelected={mockOnRemoveSelected}
      />
    );

    const addButton = screen.getByText('Add Variable');
    await user.click(addButton);

    expect(mockOnAddVariable).toHaveBeenCalledTimes(1);
  });

  it('do not render remove button if selectedCount is 0', () => {
    render(
      <EnvButtons
        selectedCount={0}
        onAddVariable={mockOnAddVariable}
        onRemoveSelected={mockOnRemoveSelected}
      />
    );

    const removeButton = screen.queryByText('Remove Selected');
    expect(removeButton).not.toBeInTheDocument();
  });

  it('render remove button if selectedCount is over 0', () => {
    render(
      <EnvButtons
        selectedCount={3}
        onAddVariable={mockOnAddVariable}
        onRemoveSelected={mockOnRemoveSelected}
      />
    );

    const removeButton = screen.getByText('Remove Selected');
    expect(removeButton).toBeInTheDocument();
  });

  it('call onRemoveSelected on Remove button click', async () => {
    const user = userEvent.setup();
    render(
      <EnvButtons
        selectedCount={2}
        onAddVariable={mockOnAddVariable}
        onRemoveSelected={mockOnRemoveSelected}
      />
    );

    const removeButton = screen.getByText('Remove Selected');
    await user.click(removeButton);

    expect(mockOnRemoveSelected).toHaveBeenCalledTimes(1);
  });

  it('have correct CSS classes', () => {
    render(
      <EnvButtons
        selectedCount={1}
        onAddVariable={mockOnAddVariable}
        onRemoveSelected={mockOnRemoveSelected}
      />
    );

    const container = screen.getByText('Add Variable').parentElement;
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('justify-end');
  });
});
