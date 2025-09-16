export const useToast = jest.fn(() => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
  toastNote: jest.fn(),
  showToast: jest.fn(),
}));

export const toast = {
  custom: jest.fn(),
  dismiss: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

export const Toaster = jest.fn(() => null);

const sonnerMock = {
  useToast,
  toast,
  Toaster,
};

export default sonnerMock;
