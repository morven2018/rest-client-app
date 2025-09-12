'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SectionRequestField from '@/components/rest/SectionRequestField';
import SectionHeaders from '@/components/rest/SectionHeaders';
import SectionCode from '@/components/rest/SectionCode';
import SectionBody from '@/components/rest/SectionBody';
import SectionResponse from '@/components/rest/SectionResponse';

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

const safeAtob = (encoded: string): string => {
  if (!encoded) return '';
  try {
    return decodeURIComponent(
      Array.from(atob(encoded))
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    console.error('Invalid base64:', e);
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
    console.error('Error encoding to base64:', e);
    return '';
  }
};

export default function RestfulPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const [requestData, setRequestData] = useState<RequestData>(() => {
    const rest = Array.isArray(params.rest) ? params.rest : [];
    const method = rest[0] || 'GET';
    const url = rest[1] ? safeAtob(rest[1]) : '';
    const body = rest[2] ? safeAtob(rest[2]) : '';

    const headers: Header[] = [];
    searchParams.forEach((value, key) => {
      if (!key.match(/^h\d+_(key|value)$/)) {
        headers.push({ key, value });
      }
    });

    return { method, url, body, headers };
  });

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

        const queryString = queryParams.toString();
        const fullUrl = queryString ? `${path}?${queryString}` : path;

        if (window.location.pathname + window.location.search !== fullUrl) {
          window.history.replaceState(null, '', fullUrl);
        }
      } catch (error) {
        console.error('Failed to update URL:', error);
      }
    },
    [params.locale]
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
    },
    []
  );

  return (
    <main className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-[17px]">
        <div className="flex flex-col gap-6 py-4">
          <SectionRequestField
            requestData={requestData}
            onRequestDataChange={handleRequestDataChange}
          />
          <SectionHeaders
            headers={requestData.headers}
            onHeadersChange={(headers) => handleRequestDataChange({ headers })}
          />
          <SectionCode />
          <SectionBody />
          <SectionResponse />
        </div>
      </div>
    </main>
  );
}
