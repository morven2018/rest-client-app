import React from 'react';
import Team from '@/components/layout/team/team';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    fill,
    sizes,
    className,
    style,
  }: {
    src: string | { src: string };
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    className?: string;
    style?: React.CSSProperties;
  }) {
    const imageSrc = typeof src === 'string' ? src : src.src;

    return (
      <div
        data-testid="team-image"
        data-src={imageSrc}
        data-alt={alt}
        data-width={width}
        data-height={height}
        data-fill={fill}
        data-sizes={sizes}
        className={className}
        style={{
          ...style,
          backgroundImage: `url(${imageSrc})`,
          width: width || '100%',
          height: height || '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-label={alt}
      />
    );
  };
});

jest.mock('../../../../public/team-img/Alena.jpg', () => ({
  src: '/team-img/Alena.jpg',
  height: 192,
  width: 192,
}));

jest.mock('../../../../public/team-img/Igor.jpg', () => ({
  src: '/team-img/Igor.jpg',
  height: 192,
  width: 192,
}));

jest.mock('../../../../public/team-img/junior.jpg', () => ({
  src: '/team-img/junior.jpg',
  height: 192,
  width: 192,
}));

describe('Team', () => {
  const mockT = jest.fn();
  const mockRaw = jest.fn();

  const mockTranslations = {
    title: 'Our Team',
    about: 'About',
    contributions: 'Contributions',
    'members.alena.name': 'Alena',
    'members.alena.description': 'Frontend Developer',
    'members.alena.githubUrl': 'https://github.com/alena',
    'members.igor.name': 'Igor',
    'members.igor.description': 'Backend Developer',
    'members.igor.githubUrl': 'https://github.com/igor',
    'members.yulia.name': 'Yulia',
    'members.yulia.description': 'Fullstack Developer',
    'members.yulia.githubUrl': 'https://github.com/yulia',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockT.mockImplementation((key: string) => {
      return mockTranslations[key as keyof typeof mockTranslations] || key;
    });

    mockRaw.mockImplementation((key: string) => {
      if (key === 'members.alena.bio') {
        return ['Alena bio line 1', 'Alena bio line 2'];
      }
      if (key === 'members.alena.contributions') {
        return ['Alena contribution 1', 'Alena contribution 2'];
      }
      if (key === 'members.igor.bio') {
        return ['Igor bio line 1'];
      }
      if (key === 'members.igor.contributions') {
        return ['Igor contribution 1'];
      }
      if (key === 'members.yulia.bio') {
        return ['Yulia bio line 1', 'Yulia bio line 2'];
      }
      if (key === 'members.yulia.contributions') {
        return ['Yulia contribution 1', 'Yulia contribution 2'];
      }
      return [];
    });

    (useTranslations as jest.Mock).mockReturnValue(
      Object.assign(mockT, { raw: mockRaw })
    );
  });

  it('render title', () => {
    render(<Team />);
    expect(screen.getByText('Our Team')).toBeInTheDocument();
  });

  it('render all team members', () => {
    render(<Team />);

    expect(screen.getByText('Alena')).toBeInTheDocument();
    expect(screen.getByText('Igor')).toBeInTheDocument();
    expect(screen.getByText('Yulia')).toBeInTheDocument();
  });

  it('render member descriptions', () => {
    render(<Team />);

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
  });

  it('render GitHub links with correct URLs', () => {
    render(<Team />);

    const links = screen.getAllByRole('link');
    const githubUrls = links.map((link) => link.getAttribute('href'));

    expect(githubUrls).toContain('https://github.com/alena');
    expect(githubUrls).toContain('https://github.com/igor');
    expect(githubUrls).toContain('https://github.com/yulia');
  });

  it('render member bios', () => {
    render(<Team />);

    expect(screen.getByText('Alena bio line 1')).toBeInTheDocument();
    expect(screen.getByText('Alena bio line 2')).toBeInTheDocument();
    expect(screen.getByText('Igor bio line 1')).toBeInTheDocument();
    expect(screen.getByText('Yulia bio line 1')).toBeInTheDocument();
    expect(screen.getByText('Yulia bio line 2')).toBeInTheDocument();
  });

  it('render member contributions', () => {
    render(<Team />);

    expect(screen.getByText('Alena contribution 1')).toBeInTheDocument();
    expect(screen.getByText('Alena contribution 2')).toBeInTheDocument();
    expect(screen.getByText('Igor contribution 1')).toBeInTheDocument();
    expect(screen.getByText('Yulia contribution 1')).toBeInTheDocument();
    expect(screen.getByText('Yulia contribution 2')).toBeInTheDocument();
  });

  it('render images with correct alt text', () => {
    render(<Team />);

    const images = screen.getAllByTestId('team-image');
    expect(images).toHaveLength(3);

    expect(images[0]).toHaveAttribute('data-alt', 'Alena');
    expect(images[1]).toHaveAttribute('data-alt', 'Igor');
    expect(images[2]).toHaveAttribute('data-alt', 'Yulia');
  });

  it('apply correct CSS classes for dark mode', () => {
    render(<Team />);

    const container = screen.getByText('Our Team').closest('div');
    expect(container).toHaveClass('dark:bg-gray-900');
  });

  it('render section headings', () => {
    render(<Team />);

    expect(screen.getAllByText('About')).toHaveLength(3);
    expect(screen.getAllByText('Contributions')).toHaveLength(3);
  });

  it('render checkmarks for contributions', () => {
    render(<Team />);

    const checkmarks = screen.getAllByText('✓');
    expect(checkmarks.length).toBeGreaterThan(0);

    checkmarks.forEach((checkmark) => {
      expect(checkmark).toHaveClass('text-green-500');
    });
  });
});
