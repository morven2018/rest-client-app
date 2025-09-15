import requestConfig from '../../src/i18n/request';

jest.mock('next-intl/server');

jest.mock('../../messages/en.json', () => ({
  default: { greeting: 'Hello', button: 'Click me' },
}));

jest.mock('../../messages/ru.json', () => ({
  default: { greeting: 'Привет', button: 'Нажми меня' },
}));

describe('request config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('use default locale when no locale provided', async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve(undefined),
    });
    expect(result.locale).toBe('en');
  });

  it('use default locale for invalid locale', async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve('fr'),
    });
    expect(result.locale).toBe('en');
  });

  it('use valid provided locale', async () => {
    const result = await requestConfig({
      requestLocale: Promise.resolve('ru'),
    });
    expect(result.locale).toBe('ru');
  });
});
