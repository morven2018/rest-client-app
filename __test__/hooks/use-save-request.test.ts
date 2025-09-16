import { act, renderHook } from '@testing-library/react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/auth/auth-context';
import { db } from '@/firebase/config';
import { useSaveRequest } from '@/hooks/use-request';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
}));

jest.mock('@/context/auth/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/firebase/config', () => ({
  db: {},
}));

describe('useSaveRequest', () => {
  const mockCurrentUser = {
    uid: 'test-user-123',
  };

  const mockRequestData = {
    method: 'GET' as const,
    status: 'ok' as const,
    code: 200,
    variables: { env: { API_URL: 'http://localhost:3000' } },
    path: '/api/test',
    url_with_vars: 'http://localhost:3000/api/test',
    Duration: 100,
    Date: '2024-01-01',
    Time: '12:00:00',
    Request_weight: '1.2KB',
    Response_weight: '2.5KB',
    Response: '{"data": "test"}',
    Headers: { 'Content-Type': 'application/json' },
    Body: '{"test": "data"}',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: mockCurrentUser });
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (doc as jest.Mock).mockImplementation((...path) => ({ path }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRequest', () => {
    it('save request successfully', async () => {
      const { result } = renderHook(() => useSaveRequest());

      let requestId: string | null = null;
      await act(async () => {
        requestId = await result.current.saveRequest(mockRequestData);
      });

      expect(requestId).toBeTruthy();
      expect(setDoc).toHaveBeenCalled();

      const [docRef, data] = (setDoc as jest.Mock).mock.calls[0];
      expect(docRef.path).toEqual([
        db,
        'users',
        mockCurrentUser.uid,
        'requests',
        requestId,
      ]);
      expect(data.userId).toBe(mockCurrentUser.uid);
      expect(data.createdAt).toBe('SERVER_TIMESTAMP');
      expect(data.updatedAt).toBe('SERVER_TIMESTAMP');
      expect(data.method).toBe('GET');
      expect(data.status).toBe('ok');
    });

    it('return null when user is not authenticated', async () => {
      (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

      const { result } = renderHook(() => useSaveRequest());

      let requestId: string | null = null;
      await act(async () => {
        requestId = await result.current.saveRequest(mockRequestData);
      });

      expect(requestId).toBeNull();
      expect(setDoc).not.toHaveBeenCalled();
    });

    it('use provided id if available', async () => {
      const { result } = renderHook(() => useSaveRequest());

      let requestId: string | null = null;
      await act(async () => {
        requestId = await result.current.saveRequest({
          ...mockRequestData,
          id: 'custom-id',
        });
      });

      expect(requestId).toBe('custom-id');
      expect(doc).toHaveBeenCalledWith(
        db,
        'users',
        mockCurrentUser.uid,
        'requests',
        'custom-id'
      );
    });

    it('handle save errors gracefully', async () => {
      (setDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

      const { result } = renderHook(() => useSaveRequest());

      let requestId: string | null = null;
      await act(async () => {
        requestId = await result.current.saveRequest(mockRequestData);
      });

      expect(requestId).toBeNull();
    });
  });

  describe('updateRequest', () => {
    it('update request successfully', async () => {
      const { result } = renderHook(() => useSaveRequest());

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateRequest('test-id', {
          status: 'error',
          code: 404,
        });
      });

      expect(success).toBe(true);

      const [docRef, data] = (updateDoc as jest.Mock).mock.calls[0];
      expect(docRef.path).toEqual([
        db,
        'users',
        mockCurrentUser.uid,
        'requests',
        'test-id',
      ]);
      expect(data.status).toBe('error');
      expect(data.code).toBe(404);
      expect(data.updatedAt).toBe('SERVER_TIMESTAMP');
    });

    it('return false when user is not authenticated', async () => {
      (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

      const { result } = renderHook(() => useSaveRequest());

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateRequest('test-id', {
          status: 'error',
        });
      });

      expect(success).toBe(false);
      expect(updateDoc).not.toHaveBeenCalled();
    });

    it('handle update errors', async () => {
      (updateDoc as jest.Mock).mockRejectedValue(new Error('Update error'));

      const { result } = renderHook(() => useSaveRequest());

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateRequest('test-id', {
          status: 'error',
        });
      });

      expect(success).toBe(false);
    });
  });

  describe('updateRequestStatus', () => {
    it('update status and code', async () => {
      const { result } = renderHook(() => useSaveRequest());

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateRequestStatus(
          'test-id',
          'error',
          500
        );
      });

      expect(success).toBe(true);

      const [docRef, data] = (updateDoc as jest.Mock).mock.calls[0];
      expect(docRef.path).toEqual([
        db,
        'users',
        mockCurrentUser.uid,
        'requests',
        'test-id',
      ]);
      expect(data.status).toBe('error');
      expect(data.code).toBe(500);
      expect(data.updatedAt).toBe('SERVER_TIMESTAMP');
    });

    it('update status without code', async () => {
      const { result } = renderHook(() => useSaveRequest());

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateRequestStatus(
          'test-id',
          'in process'
        );
      });

      expect(success).toBe(true);

      const [docRef, data] = (updateDoc as jest.Mock).mock.calls[0];
      expect(docRef.path).toEqual([
        db,
        'users',
        mockCurrentUser.uid,
        'requests',
        'test-id',
      ]);
      expect(data.status).toBe('in process');
      expect(data.updatedAt).toBe('SERVER_TIMESTAMP');
      expect(data.code).toBeUndefined();
    });
  });

  describe('updateRequestResponse', () => {
    it('update response data', async () => {
      const { result } = renderHook(() => useSaveRequest());

      let success: boolean = false;
      await act(async () => {
        success = await result.current.updateRequestResponse(
          'test-id',
          '{"new": "response"}',
          '3.0KB',
          150,
          201,
          'ok'
        );
      });

      expect(success).toBe(true);

      const [docRef, data] = (updateDoc as jest.Mock).mock.calls[0];
      expect(docRef.path).toEqual([
        db,
        'users',
        mockCurrentUser.uid,
        'requests',
        'test-id',
      ]);
      expect(data.Response).toBe('{"new": "response"}');
      expect(data.Response_weight).toBe('3.0KB');
      expect(data.Duration).toBe(150);
      expect(data.code).toBe(201);
      expect(data.status).toBe('ok');
      expect(data.updatedAt).toBe('SERVER_TIMESTAMP');
    });
  });
});
