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

describe('Code Generators', () => {
  const generators = [
    'curl',
    'fetch',
    'nodejs',
    'python',
    'java',
    'csharp',
    'go',
  ] as const;

  describe.each(generators)('%s Generator', (generator) => {
    it('generate code for valid request', () => {
      const result = generateCode(baseRequestData, generator);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('handle empty URL', () => {
      const requestData: RequestData = { ...baseRequestData, url: '' };
      const result = generateCode(requestData, generator);
      expect(result).toBe('');
    });

    it('handle empty headers', () => {
      const requestData: RequestData = { ...baseRequestData, headers: [] };
      const result = generateCode(requestData, generator);
      expect(result).not.toContain('Authorization');
    });
  });

  describe('Specific Generator Features', () => {
    it('cURL includes -H for each header', () => {
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

    it('cURL uses single quotes for body', () => {
      const requestData: RequestData = {
        ...baseRequestData,
        method: 'POST',
        body: 'test data',
      };

      const result = generateCode(requestData, 'curl');
      expect(result).toContain("-d 'test data'");
    });

    it('Fetch includes proper promise chain', () => {
      const result = generateCode(baseRequestData, 'fetch');
      expect(result).toContain('.then(response => response.json())');
      expect(result).toContain('.then(data => console.log(data))');
      expect(result).toContain('.catch(error => console.error');
    });

    it('Node.js handles HTTPS module', () => {
      const result = generateCode(baseRequestData, 'nodejs');
      expect(result).toContain("const https = require('https')");
    });

    it('Python uses requests library', () => {
      const result = generateCode(baseRequestData, 'python');
      expect(result).toContain('import requests');
    });

    it('Java includes proper imports', () => {
      const result = generateCode(baseRequestData, 'java');
      expect(result).toContain('import java.net.http.HttpClient');
    });

    it('C# uses HttpClient', () => {
      const result = generateCode(baseRequestData, 'csharp');
      expect(result).toContain('var client = new HttpClient()');
    });

    it('Go includes proper imports', () => {
      const result = generateCode(baseRequestData, 'go');
      expect(result).toContain('import (');
      expect(result).toContain('"net/http"');
    });
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
    it(`handle ${method} method correctly in curl`, () => {
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

  const testScenarios = [
    {
      name: 'URL',
      modifyRequest: (request: RequestData, value: string): RequestData => ({
        ...request,
        url: `https://api.example.com/test?value=${value}`,
      }),
    },
    {
      name: 'headers',
      modifyRequest: (request: RequestData, value: string): RequestData => ({
        ...request,
        headers: [{ key: 'X-Test', value }],
      }),
    },
    {
      name: 'body',
      modifyRequest: (request: RequestData, value: string): RequestData => ({
        ...request,
        method: 'POST',
        body: value,
      }),
    },
  ];

  testScenarios.forEach(({ name, modifyRequest }) => {
    specialCharsTestCases.forEach(({ description, value }) => {
      it(`in ${name} handle ${description}`, () => {
        const requestData = modifyRequest(baseRequestData, value);
        const result = generateCode(requestData, 'curl');
        expect(result).toContain(escapeString(value));
      });
    });
  });
});

describe('Edge Cases', () => {
  it('handle malformed JSON body', () => {
    const requestData: RequestData = {
      ...baseRequestData,
      method: 'POST',
      body: 'invalid{json',
    };
    const result = generateCode(requestData, 'curl');
    expect(result).toContain('invalid{json');
  });

  it('stringify JSON body in fetch', () => {
    const requestData: RequestData = {
      ...baseRequestData,
      method: 'POST',
      body: '{"test": "data"}',
    };

    const result = generateCode(requestData, 'fetch');
    expect(result).toContain('body: JSON.stringify({"test": "data"})');
  });

  it('handle JSON body with json parameter in python', () => {
    const requestData: RequestData = {
      ...baseRequestData,
      method: 'POST',
      body: '{"test": "data"}',
    };

    const result = generateCode(requestData, 'python');
    expect(result).toContain('json=data');
  });
});
