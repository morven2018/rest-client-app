import { act, renderHook } from '@testing-library/react';
import { SaveRequestParams, useRequestHistory } from '@/hooks/use-request';

jest.mock('@/firebase/config', () => ({
  db: {},
  auth: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({}));

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-user-123' },
  }),
}));

const mockSaveRequest = jest.fn();
const mockUpdateRequest = jest.fn();
const mockUpdateRequestStatus = jest.fn();
const mockUpdateRequestResponse = jest.fn();

jest.mock('@/hooks/use-request', () => {
  const originalModule = jest.requireActual('@/hooks/use-request');

  return {
    ...originalModule,
    useSaveRequest: () => ({
      saveRequest: mockSaveRequest,
      updateRequest: mockUpdateRequest,
      updateRequestStatus: mockUpdateRequestStatus,
      updateRequestResponse: mockUpdateRequestResponse,
    }),
  };
});

describe('useRequestHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('save API request with correct data', async () => {
    mockSaveRequest.mockResolvedValue('request-id-123');

    const { result } = renderHook(() => useRequestHistory());

    const params: SaveRequestParams = {
      method: 'POST',
      path: '/api/users',
      url_with_vars: 'https://api.example.com/api/users',
      status: 'ok',
      code: 201,
      duration: 200,
      requestWeight: '1.5KB',
      responseWeight: '2.8KB',
      response: '{"id": 1, "name": "John"}',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
      body: '{"name": "John"}',
      variables: { production: 'https://api.example.com' },
      base64Url: '',
    };

    let requestId: string | null = null;
    await act(async () => {
      requestId = await result.current.saveApiRequest(params);
    });

    expect(requestId).toBe('1704110400000');
  });

  it('handle empty body and variables', async () => {
    mockSaveRequest.mockResolvedValue('request-id-456');

    const { result } = renderHook(() => useRequestHistory());

    const params: SaveRequestParams = {
      method: 'GET',
      path: '/api/data',
      url_with_vars: 'https://api.example.com/api/data',
      status: 'ok',
      code: 200,
      duration: 100,
      requestWeight: '0.8KB',
      responseWeight: '1.2KB',
      response: '{"data": []}',
      headers: { 'Content-Type': 'application/json' },
      base64Url: '',
    };

    let requestId: string | null = null;
    await act(async () => {
      requestId = await result.current.saveApiRequest(params);
    });

    expect(requestId).toBe('1704110400000');
  });
});
