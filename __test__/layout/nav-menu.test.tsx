import NavMenu from '@/components/layout/sidebar/nav-menu';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { SidebarProvider } from '@/components/ui/sidebar';
import { usePathname, useRouter } from '@/i18n/navigation';

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  Link: jest.fn(({ children, href, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )),
}));
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string) => `Translated ${key}`),
}));

jest.mock('@/components/ui/sidebar', () => {
  const originalModule = jest.requireActual('@/components/ui/sidebar');
  return {
    ...originalModule,
    useSidebar: jest.fn(() => ({
      state: 'expanded',
      setState: jest.fn(),
      open: jest.fn(),
      close: jest.fn(),
      isMobile: false,
    })),
  };
});

const mockWindowInnerWidth = (width: number) => {
  global.innerWidth = width;
  global.dispatchEvent(new Event('resize'));
};

describe('NavMenu', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useTranslations as jest.Mock).mockReturnValue(
      (key: string) => `Translated ${key}`
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithSidebar = (component: React.ReactElement) => {
    return render(<SidebarProvider>{component}</SidebarProvider>);
  };

  it('render mobile menu if window width is less than 900px', async () => {
    mockWindowInnerWidth(800);
    (usePathname as jest.Mock).mockReturnValue('/');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      const restLink = links.find(
        (link) => link.getAttribute('href') === '/restful'
      );
      const historyLink = links.find(
        (link) => link.getAttribute('href') === '/history-and-analytics'
      );
      const variablesLink = links.find(
        (link) => link.getAttribute('href') === '/variables'
      );
      expect(restLink).toBeInTheDocument();
      expect(historyLink).toBeInTheDocument();
      expect(variablesLink).toBeInTheDocument();
    });
  });

  it('render desktop menu if window width is 900px or greater', async () => {
    mockWindowInnerWidth(900);
    (usePathname as jest.Mock).mockReturnValue('/');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      expect(screen.getByText('Translated rest')).toBeInTheDocument();
      expect(screen.getByText('Translated history')).toBeInTheDocument();
      expect(screen.getByText('Translated variables')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    const restItem = screen.getByText('Translated rest').closest('a');
    const historyItem = screen.getByText('Translated history').closest('a');
    const variablesButton = screen
      .getByText('Translated variables')
      .closest('button');

    expect(restItem?.querySelector('svg')).toBeInTheDocument();
    expect(historyItem?.querySelector('svg')).toBeInTheDocument();
    expect(variablesButton?.querySelector('svg')).toBeInTheDocument();
  });

  it('navigate to /variables on Variables button click in desktop mode', async () => {
    mockWindowInnerWidth(900);
    (usePathname as jest.Mock).mockReturnValue('/');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      const variablesButton = screen
        .getByText('Translated variables')
        .closest('button');
      expect(variablesButton).toBeInTheDocument();
      fireEvent.click(variablesButton!);
    });

    expect(mockRouterPush).toHaveBeenCalledWith('/variables');
  });

  it('add active class to Link if pathname matches in mobile mode', async () => {
    mockWindowInnerWidth(800);
    (usePathname as jest.Mock).mockReturnValue('/restful');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      const restLink = links.find(
        (link) => link.getAttribute('href') === '/restful'
      );
      expect(restLink).toHaveClass('text-violet-700');
    });
  });

  it('handle pathname starting with variables in mobile mode', async () => {
    mockWindowInnerWidth(800);
    (usePathname as jest.Mock).mockReturnValue('/variables/some-variable');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      const variablesLink = links.find(
        (link) => link.getAttribute('href') === '/variables'
      );
      expect(variablesLink).toHaveClass('text-violet-700');
    });
  });

  it('handle pathname starting with variables in desktop mode', async () => {
    mockWindowInnerWidth(900);
    (usePathname as jest.Mock).mockReturnValue('/variables/some-variable');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      const variablesButton = screen
        .getByText('Translated variables')
        .closest('button');
      expect(variablesButton).toBeInTheDocument();

      fireEvent.click(variablesButton!);
    });

    expect(mockRouterPush).toHaveBeenCalledWith('/variables');
  });

  it('set active class on desktop menu button if pathname matches', async () => {
    mockWindowInnerWidth(900);
    (usePathname as jest.Mock).mockReturnValue('/restful');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      const restLink = screen.getByText('Translated rest').closest('a');
      expect(restLink).toHaveClass(
        'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:text-violet-700 disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[active=true]:text-violet-700 data-[active=true]:dark:text-violet-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm'
      );
    });
  });

  it('handle click the variables button in desktop mode and pushes to /variables', async () => {
    mockWindowInnerWidth(900);
    (usePathname as jest.Mock).mockReturnValue('/');

    renderWithSidebar(<NavMenu />);

    await waitFor(() => {
      const variablesButton = screen
        .getByText('Translated variables')
        .closest('button');
      expect(variablesButton).toBeInTheDocument();
      fireEvent.click(variablesButton!);
    });

    expect(mockRouterPush).toHaveBeenCalledWith('/variables');
  });
});
