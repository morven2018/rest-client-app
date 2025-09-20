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

  const mockBioData = {
    'members.alena.bio': ['Alena bio line 1', 'Alena bio line 2'],
    'members.alena.contributions': [
      'Alena contribution 1',
      'Alena contribution 2',
    ],
    'members.igor.bio': ['Igor bio line 1'],
    'members.igor.contributions': ['Igor contribution 1'],
    'members.yulia.bio': ['Yulia bio line 1', 'Yulia bio line 2'],
    'members.yulia.contributions': [
      'Yulia contribution 1',
      'Yulia contribution 2',
    ],
  };

  const teamMembers = [
    {
      name: 'Alena',
      role: 'Frontend Developer',
      github: 'https://github.com/alena',
    },
    {
      name: 'Igor',
      role: 'Backend Developer',
      github: 'https://github.com/igor',
    },
    {
      name: 'Yulia',
      role: 'Fullstack Developer',
      github: 'https://github.com/yulia',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockT.mockImplementation((key: string) => {
      return mockTranslations[key as keyof typeof mockTranslations] || key;
    });

    mockRaw.mockImplementation((key: string) => {
      return mockBioData[key as keyof typeof mockBioData] || [];
    });

    (useTranslations as jest.Mock).mockReturnValue(
      Object.assign(mockT, { raw: mockRaw })
    );
  });

  const renderTeam = () => render(<Team />);

  it('render title', () => {
    renderTeam();
    expect(screen.getByText('Our Team')).toBeInTheDocument();
  });

  it('render all team members with their details', () => {
    renderTeam();

    teamMembers.forEach((member) => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      expect(screen.getByText(member.role)).toBeInTheDocument();
    });
  });

  it('render GitHub links with correct URLs', () => {
    renderTeam();

    const links = screen.getAllByRole('link');
    const githubUrls = links.map((link) => link.getAttribute('href'));

    teamMembers.forEach((member) => {
      expect(githubUrls).toContain(member.github);
    });
  });

  it('render member bios and contributions', () => {
    renderTeam();

    Object.values(mockBioData)
      .flat()
      .forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
  });

  it('render images with correct alt text', () => {
    renderTeam();

    const images = screen.getAllByTestId('team-image');
    expect(images).toHaveLength(teamMembers.length);

    teamMembers.forEach((member, index) => {
      expect(images[index]).toHaveAttribute('data-alt', member.name);
    });
  });

  it('apply correct CSS classes for dark mode', () => {
    renderTeam();
    const container = screen.getByText('Our Team').closest('div');
    expect(container).toHaveClass('dark:bg-gray-900');
  });

  it('render section headings for each member', () => {
    renderTeam();
    expect(screen.getAllByText('About')).toHaveLength(teamMembers.length);
    expect(screen.getAllByText('Contributions')).toHaveLength(
      teamMembers.length
    );
  });

  it('render checkmarks for contributions', () => {
    renderTeam();
    const checkmarks = screen.getAllByText('✓');
    expect(checkmarks.length).toBeGreaterThan(0);
    checkmarks.forEach((checkmark) => {
      expect(checkmark).toHaveClass('text-green-500');
    });
  });
});
