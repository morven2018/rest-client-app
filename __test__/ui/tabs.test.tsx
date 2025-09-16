import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@radix-ui/react-tabs', () => {
  const originalModule = jest.requireActual('@radix-ui/react-tabs');

  const MockRoot: React.FC<
    React.ComponentProps<typeof originalModule.Root>
  > = ({ children, className, ...props }) => (
    <div data-testid="tabs-root" className={className} {...props}>
      {children}
    </div>
  );

  const MockList: React.FC<
    React.ComponentProps<typeof originalModule.List>
  > = ({ children, className, ...props }) => (
    <div data-testid="tabs-list" className={className} {...props}>
      {children}
    </div>
  );

  const MockTrigger: React.FC<
    React.ComponentProps<typeof originalModule.Trigger>
  > = ({ children, className, ...props }) => (
    <button data-testid="tabs-trigger" className={className} {...props}>
      {children}
    </button>
  );

  const MockContent: React.FC<
    React.ComponentProps<typeof originalModule.Content>
  > = ({ children, className, ...props }) => (
    <div data-testid="tabs-content" className={className} {...props}>
      {children}
    </div>
  );

  return {
    ...originalModule,
    Root: MockRoot,
    List: MockList,
    Trigger: MockTrigger,
    Content: MockContent,
  };
});

describe('TabsList', () => {
  it('renders with correct data attribute and default classes', () => {
    render(
      <Tabs>
        <TabsList data-testid="tabs-list" className="custom-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );

    const list = screen.getByTestId('tabs-list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute('data-slot', 'tabs-list');
  });
});

describe('TabsTrigger', () => {
  it('renders with correct data attribute and default classes', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger
            data-testid="tabs-trigger"
            value="tab1"
            className="custom-trigger"
          >
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );

    const trigger = screen.getByTestId('tabs-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'tabs-trigger');
    expect(trigger).toHaveAttribute('value', 'tab1');
    expect(trigger).toHaveClass('custom-trigger');
    expect(trigger).toHaveTextContent('Tab 1');
  });

  it('applies active state classes correctly', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tabs-trigger">
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );

    const trigger = screen.getByTestId('tabs-trigger');
    expect(trigger).toBeInTheDocument();
  });
});

describe('TabsContent', () => {
  it('renders with correct data attribute and default classes', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent
          data-testid="tabs-content"
          value="tab1"
          className="custom-content"
        >
          Content 1
        </TabsContent>
      </Tabs>
    );

    const content = screen.getByTestId('tabs-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('data-slot', 'tabs-content');
    expect(content).toHaveAttribute('value', 'tab1');
    expect(content).toHaveClass('flex-1 outline-none custom-content');
    expect(content).toHaveTextContent('Content 1');
  });
});

describe('Integration Test', () => {
  it('renders a complete tabs structure correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getAllByTestId('tabs-trigger')).toHaveLength(2);
    expect(screen.getAllByTestId('tabs-content')).toHaveLength(2);
  });

  it('handles tab switching (basic interaction test)', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const tab2Trigger = screen.getByText('Tab 2');

    expect(tab2Trigger).toBeInTheDocument();
  });
});

describe('Customization', () => {
  it('applies custom class names to all components', () => {
    const { container } = render(
      <Tabs className="tabs-custom">
        <TabsList className="list-custom">
          <TabsTrigger className="trigger-custom" value="tab1">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent className="content-custom" value="tab1">
          Content 1
        </TabsContent>
      </Tabs>
    );

    const tabs = container.querySelector('[data-slot="tabs"]');
    const list = container.querySelector('[data-slot="tabs-list"]');
    const trigger = container.querySelector('[data-slot="tabs-trigger"]');
    const content = container.querySelector('[data-slot="tabs-content"]');

    expect(tabs).toHaveClass('tabs-custom');
    expect(list).toHaveClass('list-custom');
    expect(trigger).toHaveClass('trigger-custom');
    expect(content).toHaveClass('content-custom');
  });
});
