'use client';
import { Timestamp } from 'firebase/firestore';
import { createContext, useContext } from 'react';
import { RequestData } from '@/hooks/use-request';

export interface RequestDocument extends RequestData {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Request {
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
  variables?: Record<string, Record<string, string>>;
}

interface RequestsContextType {
  requests: RequestDocument[];
  currentRequest: RequestDocument | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;

  saveApiRequest: (request: Request) => Promise<string | null>;
  updateRequest: (
    requestId: string,
    updates: Partial<RequestData>
  ) => Promise<boolean>;
  updateRequestStatus: (
    requestId: string,
    status: RequestData['status'],
    code?: number
  ) => Promise<boolean>;
  updateRequestResponse: (
    requestId: string,
    response: string,
    responseWeight: string,
    duration: number,
    code: number,
    status?: RequestData['status']
  ) => Promise<boolean>;

  getRequests: (itemsPerPage?: number) => Promise<RequestDocument[]>;
  getRequestById: (requestId: string) => Promise<RequestDocument | null>;
  loadMoreRequests: (itemsPerPage?: number) => Promise<RequestDocument[]>;
  getRequestsByStatus: (
    status: RequestData['status'],
    itemsPerPage?: number
  ) => Promise<RequestDocument[]>;
  getRequestsByMethod: (
    method: RequestData['method'],
    itemsPerPage?: number
  ) => Promise<RequestDocument[]>;

  clearRequests: () => void;
  refetch: () => Promise<RequestDocument[]>;
}

export const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};
