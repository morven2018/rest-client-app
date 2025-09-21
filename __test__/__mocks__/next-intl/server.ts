export const getRequestConfig = jest.fn((callback) => callback);

export const getTranslations = jest.fn(() => async (key: string) => key);
export const getLocale = jest.fn(() => 'en');
export const getMessages = jest.fn(() => ({}));

const serverMock = {
  getRequestConfig,
  getTranslations,
  getLocale,
  getMessages,
};

export default serverMock;
