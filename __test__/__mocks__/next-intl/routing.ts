export const defineRouting = jest.fn().mockImplementation((config) => config);

// Для использования в тестах
export const mockRoutingConfig = {
  locales: ['en', 'ru'] as const,
  defaultLocale: 'en' as const,
};
