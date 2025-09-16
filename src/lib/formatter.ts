export const dateString = (
  date: Date = new Date(),
  locale: string = 'en'
): string => {
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: locale === 'en',
  };

  return date.toLocaleDateString(
    locale === 'en' ? 'en-US' : 'ru-RU',
    formatOptions
  );
};

export function formatBreadcrumbName(name: string): string {
  return decodeURIComponent(name);
}
