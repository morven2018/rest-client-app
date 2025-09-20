import CatchAllNotFoundPages from '@/app/[locale]/[...rest]/page';
import { render } from '@testing-library/react';
import { notFound } from 'next/navigation';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CatchAllNotFoundPages', () => {
  it('calls notFound function on render', () => {
    render(<CatchAllNotFoundPages />);
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('throws error when notFound implementation throws', () => {
    notFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });
    expect(() => render(<CatchAllNotFoundPages />)).toThrow('NEXT_NOT_FOUND');
  });
});
