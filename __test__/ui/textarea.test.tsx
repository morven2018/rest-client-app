import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('Textarea with forwardRef', () => {
  it('forwards ref to the underlying textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea data-testid="textarea" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByTestId('textarea'));
  });

  it('allows calling focus on the ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea data-testid="textarea" ref={ref} />);

    const focusSpy = jest.spyOn(ref.current!, 'focus');

    ref.current?.focus();

    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});
