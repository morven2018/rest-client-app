import { dateString, formatBreadcrumbName, formatDate } from '@/lib/formatter';

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

  test('return original string if not URI encoded', () => {
    expect(formatBreadcrumbName('Hello World')).toBe('Hello World');
    expect(formatBreadcrumbName('Test&Example')).toBe('Test&Example');
  });
});

describe('formatDate', () => {
  beforeAll(() => {
    process.env.TZ = 'UTC';
  });

  afterAll(() => {
    delete process.env.TZ;
  });

  test('format date with long month in English', () => {
    const result = formatDate('2024-01-15T14:30:00Z', 'en', false);
    expect(result).toBe('January 15, 2024');
  });

  test('format date with short month in English', () => {
    const result = formatDate('2024-01-15T14:30:00Z', 'en', true);
    expect(result).toBe('Jan 15, 2024');
  });

  test('format date with long month in Russian', () => {
    const result = formatDate('2024-01-15T14:30:00Z', 'ru', false);
    expect(result).toBe('15 января 2024 г.');
  });

  test('format date with short month in Russian', () => {
    const result = formatDate('2024-01-15T14:30:00Z', 'ru', true);
    expect(result).toBe('15 янв. 2024 г.');
  });

  test('use English locale by default', () => {
    const result = formatDate('2024-01-15T14:30:00Z');
    expect(result).toBe('January 15, 2024');
  });

  test('use long format by default', () => {
    const result = formatDate('2024-01-15T14:30:00Z', 'en');
    expect(result).toBe('January 15, 2024');
  });

  test('handle invalid date string by returning original string', () => {
    const result = formatDate('invalid-date-string');
    expect(result).toBe('invalid-date-string');
  });

  test('handle empty string input', () => {
    const result = formatDate('');
    expect(result).toBe('');
  });

  test('handle various date formats', () => {
    expect(formatDate('2024-12-25')).toBe('December 25, 2024');
    expect(formatDate('2024-07-04T00:00:00.000Z')).toBe('July 4, 2024');
    expect(formatDate('2023-02-28T20:59:59.999Z')).toBe('February 28, 2023');
  });

  test('handle edge cases with different months', () => {
    expect(formatDate('2024-02-29', 'en', true)).toBe('Feb 29, 2024');
    expect(formatDate('2023-12-31', 'en', true)).toBe('Dec 31, 2023');
    expect(formatDate('2024-01-01', 'en', true)).toBe('Jan 1, 2024');
  });
});
