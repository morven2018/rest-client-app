import generateCode, { escapeString, formatHeaders } from '@/lib/generator';
import type { RequestData } from '@/app/[locale]/restful/[[...rest]]/page';

const baseRequestData: RequestData = {
  method: 'GET',
  url: 'https://api.example.com/data',
  body: '',
  headers: [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token123' },
  ],
};

describe('Utility Functions', () => {
  describe('escapeString', () => {
    const testCases = [
      { input: 'simple', expected: 'simple' },
      { input: 'with"quotes"', expected: 'with\\"quotes\\"' },
      { input: 'with\\backslashes\\', expected: 'with\\\\backslashes\\\\' },
      { input: 'multi\nline', expected: 'multi\\nline' },
      { input: 'carriage\rreturn', expected: 'carriage\\rreturn' },
      {
        input: 'all"special\\chars\n\r',
        expected: 'all\\"special\\\\chars\\n\\r',
      },
      { input: '', expected: '' },
      { input: 'normal text 123', expected: 'normal text 123' },
      { input: '!@#$%^&*()', expected: '!@#$%^&*()' },
      { input: 'with\t tab', expected: 'with\t tab' },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`escape "${input}" correctly`, () => {
        expect(escapeString(input)).toBe(expected);
      });
    });
  });

  describe('formatHeaders', () => {
    const testCases = [
      {
        input: [{ key: 'Content-Type', value: 'application/json' }],
        expected: ['"Content-Type": "application/json"'],
      },
      {
        input: [{ key: 'Test-Key', value: 'value"with"quotes' }],
        expected: ['"Test-Key": "value\\"with\\"quotes"'],
      },
      {
        input: [
          { key: 'Header1', value: 'value1' },
          { key: 'Header2', value: 'value2' },
        ],
        expected: ['"Header1": "value1"', '"Header2": "value2"'],
      },
      {
        input: [{ key: 'Empty', value: '' }],
        expected: ['"Empty": ""'],
      },
      {
        input: [],
        expected: [],
      },
    ];

    testCases.forEach(({ input, expected }, index) => {
      it(`format headers case ${index + 1}`, () => {
        expect(formatHeaders(input)).toEqual(expected);
      });
    });
  });
});

describe('Specific Generator Tests', () => {
  describe('cURL Generator', () => {
    it('include -H for each header', () => {
      const requestData: RequestData = {
        ...baseRequestData,
        headers: [
          { key: 'Header1', value: 'value1' },
          { key: 'Header2', value: 'value2' },
        ],
      };

      const result = generateCode(requestData, 'curl');
      const headerCount = (result.match(/-H /g) || []).length;
      expect(headerCount).toBe(2);
    });

    it('use single quotes for body', () => {
      const requestData: RequestData = {
        ...baseRequestData,
        method: 'POST',
        body: 'test data',
      };

      const result = generateCode(requestData, 'curl');
      expect(result).toContain("-d 'test data'");
    });
  });

  describe('Fetch Generator', () => {
    it('include proper promise chain', () => {
      const result = generateCode(baseRequestData, 'fetch');
      expect(result).toContain('.then(response => response.json())');
      expect(result).toContain('.then(data => console.log(data))');
      expect(result).toContain('.catch(error => console.error');
    });

    it('stringify JSON body', () => {
      const requestData: RequestData = {
        ...baseRequestData,
        method: 'POST',
        body: '{"test": "data"}',
      };

      const result = generateCode(requestData, 'fetch');
      expect(result).toContain('body: JSON.stringify({"test": "data"})');
    });
  });

  describe('Node.js Generator', () => {
    it('handle HTTPS module', () => {
      const result = generateCode(baseRequestData, 'nodejs');
      expect(result).toContain("const https = require('https')");
    });

    it('parse URL components', () => {
      const result = generateCode(baseRequestData, 'nodejs');
      expect(result).toContain('hostname:');
      expect(result).toContain('path:');
    });
  });

  describe('Python Generator', () => {
    it('use requests library', () => {
      const result = generateCode(baseRequestData, 'python');
      expect(result).toContain('import requests');
    });

    it('handle JSON body with json parameter', () => {
      const requestData: RequestData = {
        ...baseRequestData,
        method: 'POST',
        body: '{"test": "data"}',
      };

      const result = generateCode(requestData, 'python');
      expect(result).toContain('json=data');
    });
  });

  describe('Java Generator', () => {
    it('include proper imports', () => {
      const result = generateCode(baseRequestData, 'java');
      expect(result).toContain('import java.net.http.HttpClient');
      expect(result).toContain('import java.net.http.HttpRequest');
    });

    it('use HttpClient', () => {
      const result = generateCode(baseRequestData, 'java');
      expect(result).toContain('HttpClient.newHttpClient()');
    });
  });

  describe('C# Generator', () => {
    it('use HttpClient', () => {
      const result = generateCode(baseRequestData, 'csharp');
      expect(result).toContain('var client = new HttpClient()');
    });

    it('use async/await', () => {
      const result = generateCode(baseRequestData, 'csharp');
      expect(result).toContain('async Task');
      expect(result).toContain('await');
    });
  });

  describe('Go Generator', () => {
    it('include proper imports', () => {
      const result = generateCode(baseRequestData, 'go');
      expect(result).toContain('import (');
      expect(result).toContain('"net/http"');
    });

    it('handle error checking', () => {
      const result = generateCode(baseRequestData, 'go');
      expect(result).toContain('if err != nil');
      expect(result).toContain('panic(err)');
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  it('return empty string for empty URL', () => {
    const requestData: RequestData = { ...baseRequestData, url: '' };
    const result = generateCode(requestData, 'curl');
    expect(result).toBe('');
  });

  it('return empty string for invalid URL', () => {
    const requestData: RequestData = {
      ...baseRequestData,
      url: 'invalid-url',
    };
    const result = generateCode(requestData, 'nodejs');
    expect(result).toBe('');
  });

  it('handle empty headers array', () => {
    const requestData: RequestData = { ...baseRequestData, headers: [] };
    const result = generateCode(requestData, 'curl');
    expect(result).not.toContain('-H');
  });

  it('handle malformed JSON body', () => {
    const requestData: RequestData = {
      ...baseRequestData,
      method: 'POST',
      body: 'invalid{json',
    };
    const result = generateCode(requestData, 'curl');
    expect(result).toContain('invalid{json');
  });
});

describe('HTTP Methods', () => {
  const methods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS',
  ] as const;

  methods.forEach((method) => {
    it(`handle ${method} method correctly`, () => {
      const requestData: RequestData = { ...baseRequestData, method };
      const result = generateCode(requestData, 'curl');

      expect(result).toContain(`-X ${method}`);

      if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        expect(result).not.toContain('-d');
      }
    });
  });
});

describe('Special Characters Handling', () => {
  const specialCharsTestCases = [
    { description: 'quotes', value: 'test"value"here' },
    { description: 'backslashes', value: 'path\\to\\file' },
    { description: 'newlines', value: 'line1\nline2' },
    { description: 'carriage returns', value: 'line1\rline2' },
    { description: 'mixed special chars', value: 'test"\\\n\r' },
    { description: 'unicode characters', value: 'café naïve' },
    { description: 'special symbols', value: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
  ];

  specialCharsTestCases.forEach(({ description, value }) => {
    it(`handle ${description} in URL`, () => {
      const requestData: RequestData = {
        ...baseRequestData,
        url: `https://api.example.com/test?value=${value}`,
      };
      const result = generateCode(requestData, 'curl');
      expect(result).toContain(escapeString(value));
    });

    it(`handle ${description} in headers`, () => {
      const requestData: RequestData = {
        ...baseRequestData,
        headers: [{ key: 'X-Test', value }],
      };
      const result = generateCode(requestData, 'curl');
      expect(result).toContain(escapeString(value));
    });

    it(`handle ${description} in body`, () => {
      const requestData: RequestData = {
        ...baseRequestData,
        method: 'POST',
        body: value,
      };
      const result = generateCode(requestData, 'curl');
      expect(result).toContain(escapeString(value));
    });
  });
});
