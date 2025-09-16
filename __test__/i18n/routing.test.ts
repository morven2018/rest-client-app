import { routing } from '../../src/i18n/routing';

jest.mock('next-intl/routing');

describe('routing configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('have correct locales array', () => {
    expect(routing.locales).toEqual(['en', 'ru']);
  });

  it('have correct default locale', () => {
    expect(routing.defaultLocale).toBe('en');
  });
});
