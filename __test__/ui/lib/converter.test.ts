import { convertFileToBase64 } from '@/lib/converter';

interface MockFileReader {
  result: string | null;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  readAsDataURL: (file: File) => void;
}

describe('convertFileToBase64', () => {
  let fileReaderInstance: MockFileReader;

  beforeEach(() => {
    fileReaderInstance = {
      readAsDataURL: jest.fn(),
      result: null,
      onload: null,
      onerror: null,
    };

    jest
      .spyOn(global, 'FileReader')
      .mockImplementation(() => fileReaderInstance as FileReader);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('resolve with base64 string', async () => {
    const mockResult = 'data:text/plain;base64,dGVzdA==';
    fileReaderInstance.result = mockResult;

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = convertFileToBase64(file);

    fileReaderInstance.onload?.();

    await expect(promise).resolves.toBe(`"${mockResult}"`);
    expect(fileReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);
  });

  test('resolve with empty string when result is null', async () => {
    fileReaderInstance.result = null;

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = convertFileToBase64(file);

    fileReaderInstance.onload?.();

    await expect(promise).resolves.toBe('');
  });

  test('reject on error', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const promise = convertFileToBase64(file);

    fileReaderInstance.onerror?.();

    await expect(promise).rejects.toThrow('Failed to convert file to Base64');
  });
});
