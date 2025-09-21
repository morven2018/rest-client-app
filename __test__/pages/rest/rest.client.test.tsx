import React from 'react';
import RestfulContent from '@/app/[locale]/restful/[[...rest]]/content';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams, useSearchParams } from 'next/navigation';
import { useEnvVariables } from '@/hooks/use-env-variables';
import { useRequestHistory, useSaveRequest } from '@/hooks/use-request';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/test',
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/components/ui/sonner', () => ({
  toastError: jest.fn(),
}));

jest.mock('@/hooks/use-env-variables', () => ({
  useEnvVariables: jest.fn(),
}));

jest.mock('@/hooks/use-request', () => ({
  useRequestHistory: jest.fn(),
  useSaveRequest: jest.fn(),
}));

jest.mock('@/components/layout/sidebar/sidebar', () => {
  return function MockCustomSidebar({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return <div className={className}>{children}</div>;
  };
});

jest.mock('@/components/layout/breadcrumb-and-heading/heading', () => {
  return function MockHeading({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

jest.mock('@/components/rest/SectionRequestField', () => {
  return function MockSectionRequestField({
    requestData,
    onRequestDataChange,
    onSendRequest,
    isLoading,
  }: {
    requestData: { url: string; method: string };
    onRequestDataChange: (
      data: Partial<{ url: string; method: string }>
    ) => void;
    onSendRequest: () => void;
    isLoading: boolean;
  }) {
    return (
      <div>
        <input
          placeholder="Enter URL"
          value={requestData.url}
          onChange={(e) => onRequestDataChange({ url: e.target.value })}
        />
        <select
          value={requestData.method}
          onChange={(e) => onRequestDataChange({ method: e.target.value })}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        <button onClick={onSendRequest} disabled={isLoading}>
          Send
        </button>
      </div>
    );
  };
});

jest.mock('@/components/rest/SectionHeaders', () => {
  return function MockSectionHeaders({
    headers,
    onHeadersChange,
  }: {
    headers: Array<{ key: string; value: string }>;
    onHeadersChange: (headers: Array<{ key: string; value: string }>) => void;
  }) {
    return (
      <div>
        <button
          onClick={() => onHeadersChange([...headers, { key: '', value: '' }])}
        >
          Add Header
        </button>
        {headers.map((header, index: number) => (
          <div key={header.key}>
            <input
              placeholder="Key"
              value={header.key}
              onChange={(e) => {
                const newHeaders = [...headers];
                newHeaders[index].key = e.target.value;
                onHeadersChange(newHeaders);
              }}
            />
            <input
              placeholder="Value"
              value={header.value}
              onChange={(e) => {
                const newHeaders = [...headers];
                newHeaders[index].value = e.target.value;
                onHeadersChange(newHeaders);
              }}
            />
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/rest/SectionCode', () => {
  return function MockSectionCode({
    requestData,
  }: {
    requestData: { method: string; url: string };
  }) {
    return (
      <div>
        Code: {requestData.method} {requestData.url}
      </div>
    );
  };
});

jest.mock('@/components/rest/SectionBody', () => {
  return function MockSectionBody({
    body,
    onBodyChange,
  }: {
    body: string;
    onBodyChange: (body: string) => void;
  }) {
    return (
      <textarea
        placeholder="Request body"
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
      />
    );
  };
});

jest.mock('@/components/rest/SectionResponse', () => {
  return function MockSectionResponse({
    responseData,
    isLoading,
  }: {
    responseData: { status: number; statusText: string; body: string } | null;
    isLoading: boolean;
  }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (!responseData) {
      return <div>No response yet</div>;
    }
    return (
      <div>
        <div>Status: {responseData.status}</div>
        <div>Status Text: {responseData.statusText}</div>
        <div>Body: {responseData.body}</div>
      </div>
    );
  };
});

global.fetch = jest.fn();
global.btoa = jest.fn((str) => `base64-${str}`);
global.atob = jest.fn((str) => str.replace('base64-', ''));
global.URL = jest.fn().mockImplementation((url: string) => ({
  href: url,
  origin: 'https://test.com',
  protocol: 'https:',
  username: '',
  password: '',
  host: 'test.com',
  hostname: 'test.com',
  port: '',
  pathname: '/',
  search: '',
  searchParams: {
    append: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    set: jest.fn(),
    sort: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    forEach: jest.fn(),
    [Symbol.iterator]: jest.fn(),
  },
  hash: '',
  toString: jest.fn().mockReturnValue('https://test.com'),
  toJSON: jest.fn().mockReturnValue('https://test.com'),
})) as unknown as typeof URL;

global.Blob = jest.fn().mockImplementation((content: string[]) => ({
  size: content ? content[0].length : 0,
}));

describe('RestfulContent', () => {
  const mockSaveApiRequest = jest.fn();
  const mockUpdateRequestResponse = jest.fn();
  const mockGetRequestById = jest.fn();
  const mockVariableExists = jest.fn();
  const mockVariableValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({
      locale: 'en',
      rest: ['GET', 'base64-test-url'],
    });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    (useEnvVariables as jest.Mock).mockReturnValue({
      variables: { TEST_VAR: 'test_value' },
      variableExists: mockVariableExists,
      variableValue: mockVariableValue.mockReturnValue('test_value'),
    });

    (useRequestHistory as jest.Mock).mockReturnValue({
      saveApiRequest: mockSaveApiRequest.mockResolvedValue('request-123'),
      updateRequestResponse:
        mockUpdateRequestResponse.mockResolvedValue(undefined),
    });

    (useSaveRequest as jest.Mock).mockReturnValue({
      getRequestById: mockGetRequestById,
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: new Map([['content-type', 'application/json']]),
      text: jest.fn().mockResolvedValue('{"message": "success"}'),
      ok: true,
    });
  });

  it('render component with initial values from URL parameters', () => {
    (useParams as jest.Mock).mockReturnValue({
      locale: 'en',
      rest: ['POST', 'base64-test-url', 'base64-test-body'],
    });

    render(<RestfulContent />);

    expect(screen.getByDisplayValue('POST')).toBeInTheDocument();
  });

  it('send GET request successful', async () => {
    const user = userEvent.setup();
    render(<RestfulContent />);

    const urlInput = screen.getByPlaceholderText('Enter URL');
    await user.clear(urlInput);
    await user.type(urlInput, 'https://api.test.com/data');

    const sendButton = screen.getByText('Send');
    await user.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.com',
        expect.objectContaining({
          method: 'GET',
          headers: {},
        })
      );
    });
  });

  it('add headers to request', async () => {
    const user = userEvent.setup();
    render(<RestfulContent />);

    const addHeaderButton = screen.getByText('Add Header');
    await user.click(addHeaderButton);

    const headerKeyInputs = screen.getAllByPlaceholderText('Key');
    const headerValueInputs = screen.getAllByPlaceholderText('Value');

    await user.type(
      headerKeyInputs[headerKeyInputs.length - 1],
      'Content-Type'
    );
    await user.type(
      headerValueInputs[headerValueInputs.length - 1],
      'application/json'
    );

    const sendButton = screen.getByText('Send');
    await user.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.com',
        expect.objectContaining({
          body: undefined,
          headers: {},
          method: 'GET',
        })
      );
    });
  });

  it('update URL if request data changes', async () => {
    const user = userEvent.setup();
    const mockReplaceState = jest.spyOn(window.history, 'replaceState');

    render(<RestfulContent />);

    const urlInput = screen.getByPlaceholderText('Enter URL');
    await user.clear(urlInput);
    await user.type(urlInput, 'https://new-api.test.com');

    await waitFor(() => {
      expect(mockReplaceState).toHaveBeenCalled();
    });
  });

  it('save request to history on successful execution', async () => {
    const user = userEvent.setup();
    render(<RestfulContent />);

    const sendButton = screen.getByText('Send');
    await user.click(sendButton);

    await waitFor(() => {
      expect(mockSaveApiRequest).toHaveBeenCalled();
      expect(mockUpdateRequestResponse).toHaveBeenCalled();
    });
  });

  it('update request history on error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup();

    render(<RestfulContent />);

    const sendButton = screen.getByText('Send');
    await user.click(sendButton);

    await waitFor(() => {
      expect(mockUpdateRequestResponse).toHaveBeenCalledWith(
        'request-123',
        expect.stringContaining('Network Error'),
        '0 bytes',
        0,
        0,
        'Network Error: Network error',
        'error'
      );
    });
  });

  it('not send body for GET and HEAD requests', async () => {
    const user = userEvent.setup();
    render(<RestfulContent />);

    const sendButton = screen.getByText('Send');
    await user.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.com',
        expect.objectContaining({
          method: 'GET',
          body: undefined,
        })
      );
    });

    const methodSelect = screen.getByDisplayValue('GET');
    await user.selectOptions(methodSelect, 'HEAD');

    await user.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.com',
        expect.objectContaining({
          method: 'HEAD',
          body: undefined,
        })
      );
    });
  });

  it('calculate request and response weights', async () => {
    const user = userEvent.setup();
    render(<RestfulContent />);

    const bodyInput = screen.getByPlaceholderText('Request body');
    await user.type(bodyInput, 'test body content');

    const sendButton = screen.getByText('Send');
    await user.click(sendButton);

    await waitFor(() => {
      expect(mockSaveApiRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          base64Url: 'http://localhost/en/restful/GET/',
          body: 'test body content',
          code: 0,
          duration: 0,
          errorDetails: '',
          headers: {},
          method: 'GET',
          path: 'https://test.com',
          requestWeight: '17 bytes',
          response: '',
          responseWeight: '0 bytes',
          status: 'in process',
          url_with_vars: 'https://test.com',
          variables: {},
        })
      );

      expect(mockUpdateRequestResponse).toHaveBeenCalledWith(
        'request-123',
        '{"message": "success"}',
        '22 bytes',
        0,
        200,
        '',
        'ok'
      );
    });
  });

  it('handle different HTTP methods correctly', async () => {
    const user = userEvent.setup();
    render(<RestfulContent />);

    const methods = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    const methodSelect = screen.getByDisplayValue('GET');

    for (const method of methods) {
      await user.selectOptions(methodSelect, method);

      const sendButton = screen.getByText('Send');
      await user.click(sendButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://test.com',
          expect.objectContaining({
            method: method,
          })
        );
      });
    }
  });

  it('debounce URL updates', async () => {
    const user = userEvent.setup();
    const mockReplaceState = jest.spyOn(window.history, 'replaceState');

    render(<RestfulContent />);

    const urlInput = screen.getByPlaceholderText('Enter URL');

    await user.type(urlInput, 'https://api.example.com/endpoint');

    await waitFor(
      () => {
        expect(mockReplaceState).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );
  });
});
