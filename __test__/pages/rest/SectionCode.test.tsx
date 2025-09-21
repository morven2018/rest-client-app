import SectionCode from '@/components/rest/SectionCode';
import generateCode from '@/lib/generator';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import type { RequestData } from '@/app/[locale]/restful/[[...rest]]/content';

jest.mock('@/lib/generator', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'RestClient.codeTitle': 'Code Generation',
      'RestClient.codeButton': 'Generate Code',
      'RestClient.codeNoUrl': 'Please enter a URL first',
      'RestClient.codeCopied': 'Copied!',
      'RestClient.codeCopy': 'Copy',
    };
    return translations[key] || key;
  },
}));

jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  ClipboardList: () => <div data-testid="clipboard-icon">Clipboard</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
}));

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: () => <div>Select Value</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-value={value}>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ ...props }: { [key: string]: unknown }) => (
    <textarea {...props} />
  ),
}));

const mockRequestData: RequestData = {
  url: 'https://api.example.com/data',
  method: 'GET',
  headers: [{ key: 'Content-Type', value: 'application/json' }],
  body: '{"test": "data"}',
};

const mockedGenerateCode = generateCode as jest.Mock;

describe('SectionCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGenerateCode.mockReturnValue('curl https://api.example.com/data');
  });

  it('render accordion with correct title', () => {
    render(<SectionCode requestData={mockRequestData} />);

    expect(screen.getByText('codeTitle')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'codeTitle' })
    ).toBeInTheDocument();
  });

  it('show code generation options when accordion is expanded', async () => {
    render(<SectionCode requestData={mockRequestData} />);

    const trigger = screen.getByRole('button', { name: 'codeTitle' });
    await userEvent.click(trigger);

    expect(screen.getByText('codeButton')).toBeInTheDocument();
  });

  it('call generateCode with correct parameters when generate button is clicked', async () => {
    render(<SectionCode requestData={mockRequestData} />);

    const accordionTrigger = screen.getByRole('button', {
      name: 'codeTitle',
    });
    await userEvent.click(accordionTrigger);

    const generateButton = screen.getByText('codeButton');
    await userEvent.click(generateButton);

    expect(mockedGenerateCode).toHaveBeenCalledWith(mockRequestData, 'curl');
  });

  it('show error message when URL is empty', async () => {
    const emptyRequestData: RequestData = {
      ...mockRequestData,
      url: '',
    };

    render(<SectionCode requestData={emptyRequestData} />);

    const accordionTrigger = screen.getByRole('button', {
      name: 'codeTitle',
    });
    await userEvent.click(accordionTrigger);

    const generateButton = screen.getByText('codeButton');
    await userEvent.click(generateButton);

    expect(screen.getByDisplayValue('codeNoUrl')).toBeInTheDocument();
    expect(mockedGenerateCode).not.toHaveBeenCalled();
  });

  it('copy generated code to clipboard', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<SectionCode requestData={mockRequestData} />);

    const accordionTrigger = screen.getByRole('button', {
      name: 'codeTitle',
    });
    await userEvent.click(accordionTrigger);

    const generateButton = screen.getByText('codeButton');
    await userEvent.click(generateButton);

    const copyButton = screen.getByRole('button', {
      name: 'Clipboard',
    });
    await userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'curl https://api.example.com/data'
    );
  });

  it('render without crashing', () => {
    expect(() =>
      render(<SectionCode requestData={mockRequestData} />)
    ).not.toThrow();
  });
});
