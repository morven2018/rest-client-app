import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/footer/Footer';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Footer.command': 'Our Team',
      'Footer.pages': 'Pages',
      'Footer.course': 'ReactJS Course',
      'Footer.logoAlt': 'RSS School Logo',
      'Footer.right-year': '© 2024',
      'Footer.right': 'All rights reserved',
      'Footer.restful': 'REST Client',
      'Footer.variables': 'Variables',
      'Footer.history-and-analytics': 'History & Analytics',
    };
    return translations[key] || key;
  },
}));

jest.mock('@/i18n/navigation', () => ({
  Link: (props: {
    href: string;
    children: React.ReactNode;
    target?: string;
    rel?: string;
    className?: string;
  }) => (
    <a
      href={props.href}
      target={props.target}
      rel={props.rel}
      className={props.className}
      data-testid="link"
    >
      {props.children}
    </a>
  ),
}));

jest.mock('lucide-react', () => ({
  Github: () => <svg data-testid="github-icon" />,
}));

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without throwing errors', () => {
    expect(() => render(<Footer />)).not.toThrow();
  });

  it('should render GitHub icons for all authors', () => {
    render(<Footer />);

    const githubIcons = screen.getAllByTestId('github-icon');
    expect(githubIcons).toHaveLength(3);
  });

  it('should render the RSS school section', () => {
    render(<Footer />);
    const rssLogo = screen.getByTestId('rss-logo');
    expect(rssLogo).toBeTruthy();
    expect(rssLogo.getAttribute('src')).toBe('/logo-rss.svg');
  });

  it('should render the RSS school link with correct attributes', () => {
    render(<Footer />);

    const links = screen.getAllByTestId('link');
    const rssLink = links.find(
      (link) => link.querySelector('[data-testid="rss-logo"]') !== null
    );

    expect(rssLink?.getAttribute('href')).toBe(
      'https://rs.school/courses/reactjs'
    );
    expect(rssLink?.getAttribute('target')).toBe('_blank');
    expect(rssLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should have correct target and rel attributes for external links', () => {
    render(<Footer />);

    const links = screen.getAllByTestId('link');
    const externalLinks = links.filter((link) =>
      link.getAttribute('href')?.includes('https://')
    );

    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('should apply correct CSS classes to footer element', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer?.className).toContain(
      'bg-neutral-200 dark:bg-[#262626] w-full pt-8'
    );
    expect(footer?.className).toContain('w-full');
    expect(footer?.className).toContain('pt-8');
  });

  it('should render all authors', () => {
    render(<Footer />);
    const authors = ['Alena Pudina', 'Ihar Batura', 'Yulia Podgurskaia'];
    authors.forEach((author) => {
      expect(screen.getByText(author)).toBeTruthy();
    });
  });

  it('should render correct number of links', () => {
    render(<Footer />);
    const links = screen.getAllByTestId('link');
    expect(links.length).toBe(7);
  });

  it('should have GitHub links for each author', () => {
    render(<Footer />);

    const links = screen.getAllByTestId('link');
    const githubLinks = links.filter((link) =>
      link.getAttribute('href')?.includes('github.com')
    );

    expect(githubLinks.length).toBe(3);

    const githubUrls = githubLinks.map((link) => link.getAttribute('href'));
    expect(githubUrls).toContain('https://github.com/morven2018');
    expect(githubUrls).toContain('https://github.com/Ihar-Batura');
    expect(githubUrls).toContain('https://github.com/yuliafire');
  });
});
