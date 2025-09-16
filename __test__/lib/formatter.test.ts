import { dateString, formatBreadcrumbName } from '@/lib/formatter';

describe('dateString', () => {
  beforeAll(() => {
    process.env.TZ = 'UTC';
  });

  afterAll(() => {
    delete process.env.TZ;
  });

  test('return formatted date string with default parameters', () => {
    const fixedDate = new Date('2024-01-15T14:30:00Z');
    const result = dateString(fixedDate);

    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2024');
    expect(result).toContain(':30');
    expect(result).toContain('PM');
  });
  test('use current date when no date provided', () => {
    const result = dateString();

    expect(typeof result).toBe('string');

    expect(result).toMatch(/^\w+ \d{1,2}, \d{4}(,| at) \d{1,2}:\d{2} (AM|PM)$/);
  });

  test('format date in Russian locale (ru-RU)', () => {
    const date = new Date('2024-01-15T14:30:00Z');
    const result = dateString(date, 'ru');

    expect(result).toContain('января');
    expect(result).toContain('15');
    expect(result).toContain('2024');
    expect(result).toContain(':30');
    expect(result).not.toContain('PM');
  });
});

describe('formatBreadcrumbName', () => {
  test('decode URI encoded strings', () => {
    expect(formatBreadcrumbName('Hello%20World')).toBe('Hello World');
    expect(formatBreadcrumbName('Test%26Example')).toBe('Test&Example');
    expect(formatBreadcrumbName('Caf%C3%A9')).toBe('Café');
    expect(formatBreadcrumbName('Price%3A%20%24100')).toBe('Price: $100');
    expect(formatBreadcrumbName('Path%2FTo%2FFile')).toBe('Path/To/File');
  });

  test('handle empty string', () => {
    expect(formatBreadcrumbName('')).toBe('');
  });

  test('handle non-ASCII characters', () => {
    expect(formatBreadcrumbName('%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82')).toBe(
      'Привет'
    );
    expect(formatBreadcrumbName('%E4%BD%A0%E5%A5%BD')).toBe('你好');
  });
});
