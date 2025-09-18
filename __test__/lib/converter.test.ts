import { convertFileToBase64 } from '@/lib/converter';

interface MockFileReader {
  result: string | ArrayBuffer | null;
  error: DOMException | null;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  onabort: (() => void) | null;
  readAsDataURL: (file: File) => void;
  abort: () => void;
}

describe('convertFileToBase64', () => {
  let fileReaderInstance: MockFileReader;

  beforeEach(() => {
    fileReaderInstance = {
      readAsDataURL: jest.fn(),
      abort: jest.fn(),
      result: null,
      error: null,
      onload: null,
      onerror: null,
      onabort: null,
    };

    jest
      .spyOn(global, 'FileReader')
      .mockImplementation(() => fileReaderInstance as unknown as FileReader);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('resolve with base64 string', async () => {
    const mockDataURL = 'data:text/plain;base64,dGVzdA==';
    fileReaderInstance.result = mockDataURL;

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = convertFileToBase64(file);

    fileReaderInstance.onload?.();

    await expect(promise).resolves.toBe('dGVzdA==');
    expect(fileReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);
  });

  test('resolve with "" when result is not a string', async () => {
    fileReaderInstance.result = new ArrayBuffer(10) as unknown as string;

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = convertFileToBase64(file);

    fileReaderInstance.onload?.();

    await expect(promise).resolves.toBe('');
  });

  test('resolve with "" when data URL format is invalid (no comma)', async () => {
    fileReaderInstance.result = 'invalid-data-url-without-comma';

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = convertFileToBase64(file);

    fileReaderInstance.onload?.();

    await expect(promise).resolves.toBe('');
  });

  test('reject on file reader error', async () => {
    const mockError = new DOMException('Network error');
    fileReaderInstance.error = mockError;

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = convertFileToBase64(file);

    fileReaderInstance.onerror?.();

    await expect(promise).rejects.toThrow('Failed to convert file to Base64');
  });
});
