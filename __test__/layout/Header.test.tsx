import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/header/Header';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Header.logoAlt': 'API Client Logo',
    };
    return translations[key] || key;
  },
}));

jest.mock('@/i18n/navigation', () => ({
  Link: (props: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={props.href} className={props.className} data-testid="header-link">
      {props.children}
    </a>
  ),
}));

jest.mock('@/components/navigate/Navigate', () => ({
  Navigate: () => <nav data-testid="navigation">Navigation Mock</nav>,
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without throwing errors', () => {
    expect(() => render(<Header />)).not.toThrow();
  });

  it('should render the header element with correct classes', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toBeTruthy();
    expect(header?.className).toContain('bg-ring');
    expect(header?.className).toContain('sticky');
    expect(header?.className).toContain('top-0');
    expect(header?.className).toContain('z-50');
    expect(header?.className).toContain('w-full');
  });

  it('should render the logo with correct attributes', () => {
    render(<Header />);

    const logo = screen.getByTestId('header-logo');
    expect(logo).toBeTruthy();
    expect(logo.getAttribute('src')).toBe('/logo.svg');
    expect(logo.getAttribute('width')).toBe('110');
    expect(logo.getAttribute('height')).toBe('90');
  });

  it('should render the logo link pointing to home', () => {
    render(<Header />);

    const logoLink = screen.getByTestId('header-link');
    expect(logoLink).toBeTruthy();
    expect(logoLink.getAttribute('href')).toBe('/');
    expect(logoLink.className).toContain('flex');
    expect(logoLink.className).toContain('items-center');
  });

  it('should render the Navigate component', () => {
    render(<Header />);

    const navigation = screen.getByTestId('navigation');
    expect(navigation).toBeTruthy();
    expect(navigation.textContent).toBe('Navigation Mock');
  });

  it('should have correct container structure', () => {
    const { container } = render(<Header />);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeTruthy();

    const flexDiv = container.querySelector(
      '.flex.h-16.items-center.justify-between'
    );
    expect(flexDiv).toBeTruthy();
  });

  it('should have correct layout structure', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    const containerDiv = header?.querySelector('.container');
    const flexDiv = containerDiv?.querySelector('.flex');
    const h1 = flexDiv?.querySelector('h1');
    const link = h1?.querySelector('a');
    const image = link?.querySelector('img');
    const navigation = flexDiv?.querySelector('nav');

    expect(header).toBeTruthy();
    expect(containerDiv).toBeTruthy();
    expect(flexDiv).toBeTruthy();
    expect(h1).toBeTruthy();
    expect(link).toBeTruthy();
    expect(image).toBeTruthy();
    expect(navigation).toBeTruthy();
  });

  it('should apply correct padding and spacing classes', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    const containerDiv = header?.querySelector('.container');

    expect(containerDiv?.className).toContain('px-4');
    expect(containerDiv?.className).toContain('sm:px-6');
    expect(containerDiv?.className).toContain('lg:px-8');
    expect(containerDiv?.className).toContain('py-[15px]');
  });
});
