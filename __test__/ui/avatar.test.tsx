import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

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
      <div
        className={className}
        data-slot={dataSlot}
        data-testid="avatar-image"
        data-src={props.src}
        data-alt={props.alt}
        {...props}
      >
        Avatar Image
      </div>
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

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    className?: string;
  }) {
    return (
      <div
        className={className}
        data-testid="next-image"
        data-src={src}
        data-alt={alt}
        {...props}
      >
        Image: {alt}
      </div>
    );
  };
});

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('render without throwing errors', () => {
      expect(() => render(<Avatar />)).not.toThrow();
    });

    it('apply default className', () => {
      const { getByTestId } = render(<Avatar />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.className).toContain('relative');
      expect(avatarRoot.className).toContain('flex');
      expect(avatarRoot.className).toContain('size-8');
      expect(avatarRoot.className).toContain('shrink-0');
      expect(avatarRoot.className).toContain('overflow-hidden');
      expect(avatarRoot.className).toContain('rounded-full');
    });

    it('merge custom className with default classes', () => {
      const { getByTestId } = render(<Avatar className="custom-class" />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.className).toContain('relative');
      expect(avatarRoot.className).toContain('custom-class');
    });

    it('have correct data-slot attribute', () => {
      const { getByTestId } = render(<Avatar />);
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.getAttribute('data-slot')).toBe('avatar');
    });

    it('pass through additional props', () => {
      const { getByTestId } = render(
        <Avatar id="test-avatar" data-test="avatar-test" />
      );
      const avatarRoot = getByTestId('avatar-root');

      expect(avatarRoot.id).toBe('test-avatar');
      expect(avatarRoot.getAttribute('data-test')).toBe('avatar-test');
    });

    it('render children', () => {
      const { getByText } = render(<Avatar>Test Content</Avatar>);
      expect(getByText('Test Content')).toBeTruthy();
    });
  });

  describe('AvatarImage', () => {
    it('render without throwing errors', () => {
      expect(() =>
        render(<AvatarImage src="/test.jpg" alt="Test" />)
      ).not.toThrow();
    });

    it('apply default className', () => {
      const { getByTestId } = render(
        <AvatarImage src="/test.jpg" alt="Test" />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.className).toContain('aspect-square');
      expect(avatarImage.className).toContain('size-full');
    });

    it('merge custom className with default classes', () => {
      const { getByTestId } = render(
        <AvatarImage src="/test.jpg" alt="Test" className="custom-class" />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.className).toContain('aspect-square');
      expect(avatarImage.className).toContain('custom-class');
    });

    it('have correct data-slot attribute', () => {
      const { getByTestId } = render(
        <AvatarImage src="/test.jpg" alt="Test" />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.getAttribute('data-slot')).toBe('avatar-image');
    });

    it('pass through image props', () => {
      const { getByTestId } = render(
        <AvatarImage
          src="/test.jpg"
          alt="Test Avatar"
          width={100}
          height={100}
        />
      );
      const avatarImage = getByTestId('avatar-image');

      expect(avatarImage.getAttribute('data-src')).toBe('/test.jpg');
      expect(avatarImage.getAttribute('data-alt')).toBe('Test Avatar');
    });
  });

  describe('AvatarFallback', () => {
    it('render without throwing errors', () => {
      expect(() => render(<AvatarFallback>FB</AvatarFallback>)).not.toThrow();
    });

    it('apply default className', () => {
      const { getByTestId } = render(<AvatarFallback>FB</AvatarFallback>);
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarFallback.className).toContain('bg-muted');
      expect(avatarFallback.className).toContain('flex');
      expect(avatarFallback.className).toContain('size-full');
      expect(avatarFallback.className).toContain('items-center');
      expect(avatarFallback.className).toContain('justify-center');
      expect(avatarFallback.className).toContain('rounded-full');
    });

    it('merge custom className with default classes', () => {
      const { getByTestId } = render(
        <AvatarFallback className="custom-class">FB</AvatarFallback>
      );
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarFallback.className).toContain('bg-muted');
      expect(avatarFallback.className).toContain('custom-class');
    });

    it('have correct data-slot attribute', () => {
      const { getByTestId } = render(<AvatarFallback>FB</AvatarFallback>);
      const avatarFallback = getByTestId('avatar-fallback');

      expect(avatarFallback.getAttribute('data-slot')).toBe('avatar-fallback');
    });

    it('render children content', () => {
      const { getByText } = render(
        <AvatarFallback>Fallback Text</AvatarFallback>
      );
      expect(getByText('Fallback Text')).toBeTruthy();
    });

    it('pass through additional props', () => {
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

  it('render complete avatar with image and fallback', () => {
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
    expect(avatarImage.getAttribute('data-src')).toBe('/user.jpg');
    expect(avatarImage.getAttribute('data-alt')).toBe('User Avatar');
    expect(avatarFallback.textContent).toBe('UA');
  });

  it('apply custom classNames to all components', () => {
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
