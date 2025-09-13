'use client';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/context/auth/auth-context';
import { db } from '@/firebase/config';
import { useRequestHistory } from '@/hooks/use-request';

import {
  RequestDocument,
  RequestsContext,
  RequestsContextType,
} from './requests-context';

import {
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  doc,
} from 'firebase/firestore';

interface RequestsProviderProps {
  children: ReactNode;
}

export const RequestsProvider: React.FC<RequestsProviderProps> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<RequestDocument[]>([]);
  const [currentRequest, setCurrentRequest] = useState<RequestDocument | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const {
    saveApiRequest,
    updateRequest,
    updateRequestStatus,
    updateRequestResponse,
  } = useRequestHistory();

  const getRequests = useCallback(
    async (itemsPerPage: number = 20) => {
      if (!currentUser) {
        setError('User not authenticated');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const requestsRef = collection(
          db,
          'users',
          currentUser.uid,
          'requests'
        );
        const q = query(
          requestsRef,
          orderBy('createdAt', 'desc'),
          limit(itemsPerPage)
        );

        const querySnapshot = await getDocs(q);
        const requestsData: RequestDocument[] = [];

        querySnapshot.forEach((doc) => {
          requestsData.push({ id: doc.id, ...doc.data() } as RequestDocument);
        });

        setRequests(requestsData);
        setLastVisible(
          querySnapshot.docs[querySnapshot.docs.length - 1] || null
        );
        setHasMore(querySnapshot.docs.length === itemsPerPage);

        return requestsData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch requests';
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const loadMoreRequests = useCallback(
    async (itemsPerPage: number = 20) => {
      if (!currentUser || !lastVisible || !hasMore) return [];

      setLoading(true);

      try {
        const requestsRef = collection(
          db,
          'users',
          currentUser.uid,
          'requests'
        );
        const q = query(
          requestsRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );

        const querySnapshot = await getDocs(q);
        const newRequests: RequestDocument[] = [];

        querySnapshot.forEach((doc) => {
          newRequests.push({ id: doc.id, ...doc.data() } as RequestDocument);
        });

        setRequests((prev) => [...prev, ...newRequests]);
        setLastVisible(
          querySnapshot.docs[querySnapshot.docs.length - 1] || null
        );
        setHasMore(querySnapshot.docs.length === itemsPerPage);

        return newRequests;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load more requests';
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentUser, lastVisible, hasMore]
  );

  const getRequestById = useCallback(
    async (requestId: string) => {
      if (!currentUser) {
        setError('User not authenticated');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const requestRef = doc(
          db,
          'users',
          currentUser.uid,
          'requests',
          requestId
        );
        const docSnapshot = await getDoc(requestRef);

        if (docSnapshot.exists()) {
          const request = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as RequestDocument;
          setCurrentRequest(request);
          return request;
        } else {
          setError('Request not found');
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch request';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const getRequestsByStatus = useCallback(
    async (status: string, itemsPerPage: number = 20) => {
      if (!currentUser) {
        setError('User not authenticated');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const requestsRef = collection(
          db,
          'users',
          currentUser.uid,
          'requests'
        );
        const q = query(
          requestsRef,
          where('status', '==', status),
          orderBy('createdAt', 'desc'),
          limit(itemsPerPage)
        );

        const querySnapshot = await getDocs(q);
        const requestsData: RequestDocument[] = [];

        querySnapshot.forEach((doc) => {
          requestsData.push({ id: doc.id, ...doc.data() } as RequestDocument);
        });

        return requestsData;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch requests by status';
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const getRequestsByMethod = useCallback(
    async (method: string, itemsPerPage: number = 20) => {
      if (!currentUser) {
        setError('User not authenticated');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const requestsRef = collection(
          db,
          'users',
          currentUser.uid,
          'requests'
        );
        const q = query(
          requestsRef,
          where('method', '==', method),
          orderBy('createdAt', 'desc'),
          limit(itemsPerPage)
        );

        const querySnapshot = await getDocs(q);
        const requestsData: RequestDocument[] = [];

        querySnapshot.forEach((doc) => {
          requestsData.push({ id: doc.id, ...doc.data() } as RequestDocument);
        });

        return requestsData;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch requests by method';
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const clearRequests = useCallback(() => {
    setRequests([]);
    setCurrentRequest(null);
    setLastVisible(null);
    setHasMore(true);
    setError(null);
  }, []);

  const refetch = useCallback(() => getRequests(20), [getRequests]);

  useEffect(() => {
    if (currentUser && requests.length === 0) {
      getRequests();
    }
  }, [currentUser, getRequests, requests.length]);

  const value: RequestsContextType = useMemo(
    () => ({
      requests,
      currentRequest,
      loading,
      error,
      hasMore,
      saveApiRequest,
      updateRequest,
      updateRequestStatus,
      updateRequestResponse,
      getRequests,
      getRequestById,
      loadMoreRequests,
      getRequestsByStatus,
      getRequestsByMethod,
      clearRequests,
      refetch,
    }),
    [
      requests,
      currentRequest,
      loading,
      error,
      hasMore,
      saveApiRequest,
      updateRequest,
      updateRequestStatus,
      updateRequestResponse,
      getRequests,
      getRequestById,
      loadMoreRequests,
      getRequestsByStatus,
      getRequestsByMethod,
      clearRequests,
      refetch,
    ]
  );

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
};
