'use client';
import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import SectionBody from '@/components/rest/SectionBody';
import SectionCode from '@/components/rest/SectionCode';
import SectionHeaders from '@/components/rest/SectionHeaders';
import SectionRequestField from '@/components/rest/SectionRequestField';
import SectionResponse from '@/components/rest/SectionResponse';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toastError } from '@/components/ui/sonner';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { useRequestHistory, useSaveRequest } from '@/hooks/use-request';

export interface Header {
  key: string;
  value: string;
}

export interface RequestData {
  method: string;
  url: string;
  body: string;
  headers: Header[];
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

export interface ApiRequest {
  id: string;
  method: string;
  path: string;
  url_with_vars?: string;
  status: string;
  code?: number;
  duration?: number;
  requestWeight?: string;
  responseWeight?: string;
  response?: string;
  headers: Record<string, string>;
  body?: string;
  variables?: Record<string, string>;
  errorDetails?: string;
  base64Url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const safeAtob = (encoded: string): string => {
  if (!encoded) return '';
  try {
    const urlDecoded = decodeURIComponent(encoded);

    if (
      !/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        urlDecoded
      )
    ) {
      return '';
    }
    return decodeURIComponent(
      Array.from(atob(urlDecoded))
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    toastError('Invalid base64', {
      additionalMessage: e instanceof Error ? e.message : 'Check your value',
      duration: 3000,
    });
    return '';
  }
};

const safeBtoa = (str: string): string => {
  if (!str) return '';
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch (e) {
    toastError('Error encoding to base64', {
      additionalMessage: e instanceof Error ? e.message : 'Check your code',
      duration: 3000,
    });
    return '';
  }
};

const HTTP_STATUS_TEXTS: Record<number, string> = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
};

export default function RestfulContent() {
  const { variables, variableExists, variableValue } = useEnvVariables();
  const { saveApiRequest, updateRequestResponse } = useRequestHistory();
  const { getRequestById } = useSaveRequest();

  const params = useParams();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');

  const [requestData, setRequestData] = useState<RequestData>(() => {
    const rest = Array.isArray(params.rest) ? params.rest : [];
    const method = rest[0] || 'GET';
    const url = rest[1] ? safeAtob(rest[1]) : '';
    const body = rest[2] ? safeAtob(rest[2]) : '';
    const headers: Header[] = [];

    searchParams.forEach((value, key) => {
      if (key !== 'RequestId' && !key.match(/^h\d+_(key|value)$/)) {
        headers.push({ key, value });
      }
    });

    return { method, url, body, headers };
  });

  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedRequest, setLoadedRequest] = useState<ApiRequest | null>(null);

  const substituteVariables = useCallback(
    (text: string): string => {
      if (!text || !variables) return text;

      return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        return variableExists(varName) ? variableValue(varName) : match;
      });
    },
    [variables, variableExists, variableValue]
  );

  useEffect(() => {
    const loadIfNeeded = async () => {
      const requestId = searchParams.get('RequestId');
      if (!requestId) return;

      try {
        const historyData = await getRequestById(requestId);
        if (historyData) {
          if (historyData.Response) {
            setResponseData({
              status: Number(historyData.code) || 100,
              statusText: historyData.status.toUpperCase(),
              headers: historyData.Headers || {},
              body: historyData.Response,
            });
          }
        }
      } catch (error) {
        toastError('Failed to load request', {
          additionalMessage: error instanceof Error ? error.message : '',
          duration: 3000,
        });
      }
    };

    loadIfNeeded();
  }, [searchParams, getRequestById]);

  const sendRequest = async () => {
    setIsLoading(true);
    let dbRequestId: string | null = null;
    try {
      const substitutedUrl = substituteVariables(requestData.url);
      const substitutedBody = substituteVariables(requestData.body);
      const headers = Object.fromEntries(
        requestData.headers
          .filter((h) => h.key && h.value)
          .map((h) => [h.key, substituteVariables(h.value)])
      );
      const url = new URL(substitutedUrl);
      requestData.headers
        .filter((h) => h.key && h.value)
        .forEach((h) => {
          url.searchParams.append(h.key, substituteVariables(h.value));
        });

      const finalUrl = url.toString();

      const shouldSendBody = !['GET', 'HEAD'].includes(requestData.method);

      const requestWeight = `${new Blob([substitutedBody]).size} bytes`;

      const base64Url = window.location.href;

      dbRequestId = await saveApiRequest({
        method: requestData.method as
          | 'GET'
          | 'HEAD'
          | 'POST'
          | 'PUT'
          | 'PATCH'
          | 'DELETE'
          | 'OPTIONS',
        path: finalUrl,
        url_with_vars: finalUrl,
        status: 'in process',
        code: 0,
        duration: 0,
        requestWeight: requestWeight,
        responseWeight: '0 bytes',
        response: '',
        headers: headers,
        body: substitutedBody,
        variables: {},
        errorDetails: '',
        base64Url: base64Url,
      });

      if (!dbRequestId) {
        throw new Error('Failed to save request to database');
      }

      const startTime = Date.now();
      const response = await fetch(finalUrl, {
        method: requestData.method,
        headers,
        body: shouldSendBody ? substitutedBody : undefined,
      });
      const endTime = Date.now();
      const duration = endTime - startTime;

      const responseBody = await response.text();
      const statusText =
        response.statusText ||
        HTTP_STATUS_TEXTS[response.status] ||
        'Unknown Status';
      const responseSize = new Blob([responseBody]).size;
      const responseWeight = `${responseSize} bytes`;

      await updateRequestResponse(
        dbRequestId,
        responseBody,
        responseWeight,
        duration,
        response.status,
        response.ok ? '' : `HTTP ${response.status}: ${statusText}`,
        response.ok ? 'ok' : 'error'
      );

      setResponseData({
        status: response.status,
        statusText: statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
      });

      if (loadedRequest && loadedRequest.id === dbRequestId) {
        setLoadedRequest((prev) =>
          prev
            ? {
                ...prev,
                code: response.status,
                status: response.ok ? 'ok' : 'error',
                response: responseBody,
                duration,
                responseWeight,
                updatedAt: new Date(),
              }
            : null
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = `Network Error: ${errorMessage}`;

      toastError('Request failed', {
        additionalMessage: errorMessage,
        duration: 3000,
      });

      setResponseData({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: errorDetails,
      });

      if (dbRequestId) {
        await updateRequestResponse(
          dbRequestId,
          errorDetails,
          '0 bytes',
          0,
          0,
          errorDetails,
          'error'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUrl = useCallback(
    (data: RequestData) => {
      try {
        const locale = (params.locale as string) || 'en';

        const base64Url = safeBtoa(data.url);
        const base64Body = data.body ? safeBtoa(data.body) : '';

        const pathParts = [locale, 'restful', data.method, base64Url];
        if (base64Body) {
          pathParts.push(base64Body);
        }

        const path = `/${pathParts.join('/')}`;

        const queryParams = new URLSearchParams();
        data.headers.forEach((header) => {
          if (header.key || header.value) {
            queryParams.append(header.key, header.value);
          }
        });

        if (requestId) {
          queryParams.append('requestId', requestId);
        }

        const queryString = queryParams.toString();
        const fullUrl = queryString ? `${path}?${queryString}` : path;

        if (window.location.pathname + window.location.search !== fullUrl) {
          window.history.replaceState(null, '', fullUrl);
        }
      } catch (error) {
        toastError('Failed to update URL', {
          additionalMessage:
            error instanceof Error ? error.message : "Can't update your URL",
          duration: 3000,
        });
      }
    },
    [params.locale, requestId]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrl(requestData);
    }, 100);

    return () => clearTimeout(handler);
  }, [requestData, updateUrl]);

  const handleRequestDataChange = useCallback(
    (newData: Partial<RequestData>) => {
      setRequestData((prev) => ({ ...prev, ...newData }));
      if (loadedRequest) {
        setLoadedRequest(null);
      }
    },
    [loadedRequest]
  );

  const handleBodyChange = useCallback(
    (body: string) => {
      setRequestData((prev) => ({ ...prev, body }));
      if (loadedRequest) {
        setLoadedRequest(null);
      }
    },
    [loadedRequest]
  );

  return (
    <main>
      <CustomSidebar className="min-h-120">
        <Heading>
          <div className="flex flex-col gap-6 py-4">
            <SectionRequestField
              requestData={requestData}
              onRequestDataChange={handleRequestDataChange}
              onSendRequest={sendRequest}
              isLoading={isLoading}
            />
            <SectionHeaders
              headers={requestData.headers}
              onHeadersChange={(headers) =>
                handleRequestDataChange({ headers })
              }
            />
            <SectionCode requestData={requestData} />
            <SectionBody
              body={requestData.body}
              onBodyChange={handleBodyChange}
            />
            <SectionResponse
              responseData={responseData}
              isLoading={isLoading}
            />
          </div>
        </Heading>
      </CustomSidebar>
    </main>
  );
}
