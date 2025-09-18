import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { AvatarInput } from '@/components/ui/avatar-input';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, onClick, type, variant }) => (
    <button
      type={type}
      onClick={onClick}
      data-testid="avatar-button"
      data-variant={variant}
    >
      {children}
    </button>
  )),
}));

jest.mock('@/components/ui/input', () => ({
  Input: jest.fn(
    ({
      type,
      placeholder,
      value,
      readOnly,
      className,
      onChange,
      ref,
      accept,
    }) => {
      if (type === 'file') {
        return (
          <input
            type="file"
            accept={accept}
            onChange={onChange}
            ref={ref}
            data-testid="file-input"
            className={className}
            style={{ display: 'none' }}
          />
        );
      }

      return (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          className={className}
          data-testid="text-input"
        />
      );
    }
  ),
}));

describe('AvatarInput', () => {
  const mockOnAvatarChange = jest.fn();
  const mockT = jest.fn((key) => {
    const translations: Record<string, string> = {
      'btn-avatar': 'Upload Avatar',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    jest.clearAllMocks();
  });

  it('render correct with default props', () => {
    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(screen.getByTestId('text-input')).toHaveAttribute(
      'placeholder',
      'Choose an avatar...'
    );
    expect(screen.getByTestId('text-input')).toHaveValue('');

    expect(screen.getByTestId('avatar-button')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-button')).toHaveTextContent(
      'Upload Avatar'
    );

    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toHaveAttribute(
      'accept',
      'image/*'
    );
  });

  it('render with custom placeholder', () => {
    render(
      <AvatarInput
        onAvatarChange={mockOnAvatarChange}
        placeholder="Select your photo..."
      />
    );

    expect(screen.getByTestId('text-input')).toHaveAttribute(
      'placeholder',
      'Select your photo...'
    );
  });

  it('handle file selection with valid image', () => {
    const file = new File(['test'], 'avatar.png', { type: 'image/png' });

    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByTestId('text-input')).toHaveValue('avatar.png');
    expect(mockOnAvatarChange).toHaveBeenCalledWith(file);
  });

  it('handle file selection with invalid file type', () => {
    const file = new File(['test'], 'document.pdf', {
      type: 'application/pdf',
    });

    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByTestId('text-input')).toHaveValue('');
    expect(mockOnAvatarChange).toHaveBeenCalledWith(null);
  });

  it('handle empty file selection', () => {
    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(screen.getByTestId('text-input')).toHaveValue('');
    expect(mockOnAvatarChange).toHaveBeenCalledWith(null);
  });

  it('trigger file input click when button is clicked', () => {
    const clickSpy = jest.fn();

    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    const fileInput = screen.getByTestId('file-input');
    fileInput.click = clickSpy;

    const button = screen.getByTestId('avatar-button');
    fireEvent.click(button);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('not call onAvatarChange when prop is not provided', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<AvatarInput />);

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('use translation for button text', () => {
    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    expect(mockT).toHaveBeenCalledWith('btn-avatar');
    expect(screen.getByTestId('avatar-button')).toHaveTextContent(
      'Upload Avatar'
    );
  });

  it('maintain file name when selecting multiple valid files', () => {
    const file1 = new File(['test1'], 'avatar1.png', { type: 'image/png' });
    const file2 = new File(['test2'], 'avatar2.jpg', { type: 'image/jpeg' });

    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file1] } });
    expect(screen.getByTestId('text-input')).toHaveValue('avatar1.png');
    expect(mockOnAvatarChange).toHaveBeenCalledWith(file1);

    fireEvent.change(fileInput, { target: { files: [file2] } });
    expect(screen.getByTestId('text-input')).toHaveValue('avatar2.jpg');
    expect(mockOnAvatarChange).toHaveBeenCalledWith(file2);
  });

  it('clear file name when selecting invalid file after valid file', () => {
    const validFile = new File(['test'], 'avatar.png', { type: 'image/png' });
    const invalidFile = new File(['test'], 'document.pdf', {
      type: 'application/pdf',
    });

    render(<AvatarInput onAvatarChange={mockOnAvatarChange} />);

    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [validFile] } });
    expect(screen.getByTestId('text-input')).toHaveValue('avatar.png');

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(screen.getByTestId('text-input')).toHaveValue('');
    expect(mockOnAvatarChange).toHaveBeenCalledWith(null);
  });
});
