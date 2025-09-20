'use client';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { toastError, toastNote, toastSuccess } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { db } from '@/firebase/config';

export interface RequestData {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  status: 'ok' | 'error' | 'in process' | 'not send';
  code: number;
  variables: Record<string, string> | object;
  path: string;
  url_with_vars: string;
  Duration: number;
  Date: string;
  Time: string;
  Request_weight: string;
  Response_weight: string;
  Response: string;
  Headers: Record<string, string>;
  Body: string;
  errorDetails: string;
  base64Url: string;
}

export interface SaveRequestParams {
  method: RequestData['method'];
  path: string;
  url_with_vars: string;
  status: RequestData['status'];
  code: number;
  duration: number;
  requestWeight: string;
  responseWeight: string;
  response: string;
  headers: Record<string, string>;
  body?: string;
  variables?: Record<string, string>;
  errorDetails?: string;
  base64Url: string;
}

export const useSaveRequest = () => {
  const { currentUser } = useAuth();

  const saveRequest = useCallback(
    async (requestData: Omit<RequestData, 'id'> & { id?: string }) => {
      if (!currentUser) {
        toastNote('User not authenticated. Cannot save request.');
        return null;
      }

      try {
        const requestId = requestData.id || Date.now().toString();
        const fullRequestData: RequestData = {
          ...requestData,
          id: requestId,
        };

        const requestRef = doc(
          db,
          'users',
          currentUser.uid,
          'requests',
          requestId
        );

        await setDoc(requestRef, {
          ...fullRequestData,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        toastSuccess('Request saved successfully!');
        return requestId;
      } catch (error) {
        console.error('Error saving request:', error);
        toastError('Failed to save request');
        return null;
      }
    },
    [currentUser]
  );

  const updateRequest = useCallback(
    async (
      requestId: string,
      updates: Partial<Omit<RequestData, 'id' | 'userId' | 'createdAt'>>
    ) => {
      if (!currentUser) {
        return false;
      }

      try {
        const requestRef = doc(
          db,
          'users',
          currentUser.uid,
          'requests',
          requestId
        );

        await updateDoc(requestRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });

        return true;
      } catch (error) {
        console.error('Error updating request:', error);
        toastError('Error updating request');
        return false;
      }
    },
    [currentUser]
  );

  const updateRequestStatus = useCallback(
    async (requestId: string, status: RequestData['status'], code?: number) => {
      const updates: Partial<RequestData> = { status };
      if (code !== undefined) {
        updates.code = code;
      }

      return await updateRequest(requestId, updates);
    },
    [updateRequest]
  );

  const updateRequestResponse = useCallback(
    async (
      requestId: string,
      response: string,
      responseWeight: string,
      duration: number,
      code: number,
      status: RequestData['status'] = 'ok',
      errorDetails: string
    ) => {
      const updates: Partial<RequestData> = {
        Response: response,
        Response_weight: responseWeight,
        Duration: duration,
        code,
        status,
        errorDetails,
      };

      return await updateRequest(requestId, updates);
    },
    [updateRequest]
  );

  return {
    saveRequest,
    updateRequest,
    updateRequestStatus,
    updateRequestResponse,
  };
};

export const useRequestHistory = () => {
  const {
    saveRequest,
    updateRequest,
    updateRequestStatus,
    updateRequestResponse,
  } = useSaveRequest();

  const saveApiRequest = useCallback(
    async (params: SaveRequestParams): Promise<string | null> => {
      const {
        method,
        path,
        url_with_vars,
        status,
        code,
        duration,
        requestWeight,
        responseWeight,
        response,
        headers,
        body = '',
        variables = {},
        errorDetails = '',
        base64Url,
      } = params;

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0];

      const requestData: Omit<RequestData, 'id'> = {
        method,
        status,
        code,
        variables,
        path,
        url_with_vars,
        Duration: duration,
        Date: date,
        Time: time,
        Request_weight: requestWeight,
        Response_weight: responseWeight,
        Response: response,
        Headers: headers,
        Body: body,
        errorDetails,
        base64Url,
      };

      return await saveRequest(requestData);
    },
    [saveRequest]
  );

  return {
    saveApiRequest,
    updateRequest,
    updateRequestStatus,
    updateRequestResponse,
  };
};
