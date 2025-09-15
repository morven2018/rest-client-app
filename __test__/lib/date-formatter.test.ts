import dateString from '@/lib/date-formatter';

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
