import NotFound from '@/app/[locale]/not-found';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, onClick, className, variant, asChild }) => {
    if (asChild) {
      return <div className={className}>{children}</div>;
    }
    return (
      <button onClick={onClick} className={className} data-variant={variant}>
        {children}
      </button>
    );
  }),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: jest.fn(({ children, href }) => <a href={href}>{children}</a>),
  useRouter: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  House: () => <div data-testid="house-icon" />,
  RotateCcw: () => <div data-testid="rotate-icon" />,
}));

describe('NotFound', () => {
  const mockBack = jest.fn();
  const mockT = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockT.mockImplementation((key) => {
      const translations = {
        'NotFound.title': 'Page Not Found',
        'NotFound.back': 'Go Back',
        'NotFound.home': 'Home',
      };
      return translations[key as keyof typeof translations];
    });

    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
  });

  it('renders correct structure and calls translations', () => {
    const mockT = jest.fn((key: string) => key);
    (useTranslations as jest.Mock).mockReturnValue(mockT);

    render(<NotFound />);

    expect(screen.getByTestId('house-icon')).toBeInTheDocument();
    expect(screen.getByTestId('rotate-icon')).toBeInTheDocument();

    expect(mockT).toHaveBeenCalledWith('title');
    expect(mockT).toHaveBeenCalledWith('back');
    expect(mockT).toHaveBeenCalledWith('home');
  });

  it('calls router.back when Go Back button is clicked', () => {
    render(<NotFound />);

    const rotateIcon = screen.getByTestId('rotate-icon');
    const backButton = rotateIcon.closest('button');

    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton!);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('has correct Link for Home button', () => {
    render(<NotFound />);
    const homeLinks = screen.getAllByRole('link');
    const targetLink = homeLinks.find(
      (link) => link.getAttribute('href') === '/'
    );

    expect(targetLink).toBeInTheDocument();
    expect(targetLink).toHaveAttribute('href', '/');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<NotFound />);

    expect(container.querySelector('.bg-not-found')).toBeInTheDocument();
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.mx-auto')).toBeInTheDocument();
  });
});
