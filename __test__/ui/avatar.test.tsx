import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

// Mock @radix-ui/react-avatar
jest.mock('@radix-ui/react-avatar', () => {
  const originalModule = jest.requireActual('@radix-ui/react-avatar');
  return {
    ...originalModule,
    Root: ({
      className,
      children,
      'data-slot': dataSlot,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
      'data-slot'?: string;
    }) => (
      <div
        className={className}
        data-slot={dataSlot}
        data-testid="avatar-root"
        {...props}
      >
        {children}
      </div>
    ),
    Image: ({
      className,
      'data-slot': dataSlot,
      ...props
    }: {
      className?: string;
      'data-slot'?: string;
      src?: string;
      alt?: string;
    }) => (
      <img
        alt={props.alt}
        className={className}
        data-slot={dataSlot}
        data-testid="avatar-image"
        {...props}
      />
    ),
    Fallback: ({
      className,
      children,
      'data-slot': dataSlot,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
      'data-slot'?: string;
    }) => (
      <div
        className={className}
        data-slot={dataSlot}
        data-testid="avatar-fallback"
        {...props}
      >
        {children}
      </div>
    ),
  };
});

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('should render without throwing errors', () => {
      expect(() => render(<Avatar />)).not.toThrow();
    });

    it('should apply default className', () => {
      const { getByTestId } = render(<Avatar />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.className).toContain('relative');
      expect(avatarRoot.className).toContain('flex');
      expect(avatarRoot.className).toContain('size-8');
      expect(avatarRoot.className).toContain('shrink-0');
      expect(avatarRoot.className).toContain('overflow-hidden');
      expect(avatarRoot.className).toContain('rounded-full');
    });

    it('should merge custom className with default classes', () => {
      const { getByTestId } = render(<Avatar className="custom-class" />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.className).toContain('relative');
      expect(avatarRoot.className).toContain('custom-class');
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(<Avatar />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.getAttribute('data-slot')).toBe('avatar');
    });

    it('should pass through additional props', () => {
      const { getByTestId } = render(
        <Avatar id="test-avatar" data-test="avatar-test" />
      );
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.id).toBe('test-avatar');
      expect(avatarRoot.getAttribute('data-test')).toBe('avatar-test');
    });

    it('should render children', () => {
      const { getByText } = render(<Avatar>Test Content</Avatar>);
      expect(getByText('Test Content')).toBeTruthy();
    });
  });

  describe('AvatarImage', () => {
    it('should render without throwing errors', () => {
      expect(() =>
        render(<AvatarImage src="/test.jpg" alt="Test" />)
      ).not.toThrow();
    });

    it('should apply default className', () => {
      const { getByTestId } = render(
        <AvatarImage src="/test.jpg" alt="Test" />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.className).toContain('aspect-square');
      expect(avatarImage.className).toContain('size-full');
    });

    it('should merge custom className with default classes', () => {
      const { getByTestId } = render(
        <AvatarImage src="/test.jpg" alt="Test" className="custom-class" />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.className).toContain('aspect-square');
      expect(avatarImage.className).toContain('custom-class');
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(
        <AvatarImage src="/test.jpg" alt="Test" />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.getAttribute('data-slot')).toBe('avatar-image');
    });

    it('should pass through image props', () => {
      const { getByTestId } = render(
        <AvatarImage
          src="/test.jpg"
          alt="Test Avatar"
          width={100}
          height={100}
        />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.getAttribute('src')).toBe('/test.jpg');
      expect(avatarImage.getAttribute('alt')).toBe('Test Avatar');
    });
  });

  describe('AvatarFallback', () => {
    it('should render without throwing errors', () => {
      expect(() => render(<AvatarFallback>FB</AvatarFallback>)).not.toThrow();
    });

    it('should apply default className', () => {
      const { getByTestId } = render(<AvatarFallback>FB</AvatarFallback>);
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarFallback.className).toContain('bg-muted');
      expect(avatarFallback.className).toContain('flex');
      expect(avatarFallback.className).toContain('size-full');
      expect(avatarFallback.className).toContain('items-center');
      expect(avatarFallback.className).toContain('justify-center');
      expect(avatarFallback.className).toContain('rounded-full');
    });

    it('should merge custom className with default classes', () => {
      const { getByTestId } = render(
        <AvatarFallback className="custom-class">FB</AvatarFallback>
      );
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarFallback.className).toContain('bg-muted');
      expect(avatarFallback.className).toContain('custom-class');
    });

    it('should have correct data-slot attribute', () => {
      const { getByTestId } = render(<AvatarFallback>FB</AvatarFallback>);
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarFallback.getAttribute('data-slot')).toBe('avatar-fallback');
    });

    it('should render children content', () => {
      const { getByText } = render(
        <AvatarFallback>Fallback Text</AvatarFallback>
      );
      expect(getByText('Fallback Text')).toBeTruthy();
    });

    it('should pass through additional props', () => {
      const { getByTestId } = render(
        <AvatarFallback id="test-fallback" data-test="fallback-test">
          FB
        </AvatarFallback>
      );
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarFallback.id).toBe('test-fallback');
      expect(avatarFallback.getAttribute('data-test')).toBe('fallback-test');
    });
  });

  describe('Integration: Complete Avatar with Image and Fallback', () => {
    it('should render a complete avatar with image and fallback', () => {
      render(
        <Avatar>
          <AvatarImage src="/user.jpg" alt="User Avatar" />
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
      );

      const avatarRoot = screen.getByTestId('avatar-root');
      const avatarImage = screen.getByTestId('avatar-image');
      const avatarFallback = screen.getByTestId('avatar-fallback');

      expect(avatarRoot).toBeTruthy();
      expect(avatarImage).toBeTruthy();
      expect(avatarFallback).toBeTruthy();
      expect(avatarImage.getAttribute('src')).toBe('/user.jpg');
      expect(avatarImage.getAttribute('alt')).toBe('User Avatar');
      expect(avatarFallback.textContent).toBe('UA');
    });

    it('should apply custom classNames to all components', () => {
      const { getByTestId } = render(
        <Avatar className="avatar-custom">
          <AvatarImage src="/user.jpg" alt="User" className="image-custom" />
          <AvatarFallback className="fallback-custom">FB</AvatarFallback>
        </Avatar>
      );

      const avatarRoot = getByTestId('avatar-root');
      const avatarImage = getByTestId('avatar-image');
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarRoot.className).toContain('avatar-custom');
      expect(avatarImage.className).toContain('image-custom');
      expect(avatarFallback.className).toContain('fallback-custom');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined className gracefully', () => {
      const { getByTestId } = render(<Avatar className={undefined} />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.className).toContain('relative');
    });

    it('should handle empty string className', () => {
      const { getByTestId } = render(<Avatar className="" />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.className).toContain('relative');
    });
  });
});

describe('Avatar Components Snapshot', () => {
  it('Avatar should match snapshot', () => {
    const { container } = render(<Avatar />);
    expect(container).toMatchSnapshot();
  });

  it('AvatarImage should match snapshot', () => {
    const { container } = render(<AvatarImage src="/test.jpg" alt="Test" />);
    expect(container).toMatchSnapshot();
  });

  it('AvatarFallback should match snapshot', () => {
    const { container } = render(<AvatarFallback>FB</AvatarFallback>);
    expect(container).toMatchSnapshot();
  });

  it('Complete Avatar should match snapshot', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/user.jpg" alt="User" />
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );
    expect(container).toMatchSnapshot();
  });
});
