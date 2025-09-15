import { cn } from '@/lib/utils';

describe('cn function', () => {
  test('should merge basic class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  test('handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn('base', {
      active: isActive,
      disabled: isDisabled,
      always: true,
    });

    expect(result).toBe('base active always');
  });

  test('handle arrays of class names', () => {
    const result = cn(['class1', 'class2'], 'class3', ['class4']);
    expect(result).toBe('class1 class2 class3 class4');
  });

  test('merge Tailwind CSS classes correctly', () => {
    const result = cn('p-2 p-4', 'm-1 m-3');
    expect(result).toBe('p-4 m-3');
  });

  test('handle complex Tailwind conflicts', () => {
    const result = cn('bg-red-500 bg-blue-500', 'text-sm text-lg');
    expect(result).toBe('bg-blue-500 text-lg');
  });

  test('handle undefined, null, and false values', () => {
    const result = cn('base', undefined, null, false, 'valid');
    expect(result).toBe('base valid');
  });

  test('merge padding and margin utilities correctly', () => {
    const result = cn('p-2', 'p-4', 'm-1', 'm-2');
    expect(result).toBe('p-4 m-2');
  });

  test('handle responsive classes', () => {
    const result = cn('sm:p-2 md:p-4', 'sm:p-3');
    expect(result).toBe('md:p-4 sm:p-3');
  });
});
