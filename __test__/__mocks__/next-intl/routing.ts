export const defineRouting = jest.fn().mockImplementation((config) => config);

export const mockRoutingConfig = {
  locales: ['en', 'ru'] as const,
  defaultLocale: 'en' as const,
};
