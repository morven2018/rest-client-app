export const getRequestConfig = jest.fn((callback) => callback);

export const getTranslations = jest.fn(() => async (key: string) => key);
export const getLocale = jest.fn(() => 'en');
export const getMessages = jest.fn(() => ({}));

export default {
  getRequestConfig,
  getTranslations,
  getLocale,
  getMessages,
};
