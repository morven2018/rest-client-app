import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';

const onChange = jest.fn();

describe('Input', () => {
  it('render input element with correct type', () => {
    render(<Input type="text" onChange={onChange} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveAttribute('data-slot', 'input');
  });

  it('render input element with correct value', () => {
    render(<Input type="text" value="test value" onChange={onChange} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue('test value');
  });

  it('apply custom class names', () => {
    render(
      <Input type="text" className="my-custom-class" onChange={onChange} />
    );
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('my-custom-class');
  });

  it('handle onChange event correctly', () => {
    render(<Input type="text" onChange={onChange} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('pass other props to the input element', () => {
    render(
      <Input
        type="text"
        placeholder="Enter text"
        disabled
        onChange={onChange}
      />
    );
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text');
    expect(inputElement).toBeDisabled();
  });

  it('display placeholder text', () => {
    render(
      <Input type="text" placeholder="Enter your name" onChange={onChange} />
    );
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter your name');
  });
});
