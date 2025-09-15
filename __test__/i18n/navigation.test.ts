import * as navigationModule from '../../src/i18n/navigation';
import { createNavigation } from 'next-intl/navigation';

jest.mock('next-intl/navigation');

(createNavigation as jest.Mock).mockReturnValue({
  Link: jest.fn(),
  redirect: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  getPathname: jest.fn(),
});

describe('navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('export Link component', () => {
    expect(navigationModule.Link).toBeDefined();
  });

  it('export redirect function', () => {
    expect(navigationModule.redirect).toBeDefined();
  });

  it('export usePathname hook', () => {
    expect(navigationModule.usePathname).toBeDefined();
  });

  it('export useRouter hook', () => {
    expect(navigationModule.useRouter).toBeDefined();
  });

  it('export getPathname function', () => {
    expect(navigationModule.getPathname).toBeDefined();
  });

  it('mock functions for navigation utilities', () => {
    expect(typeof navigationModule.Link).toBe('function');
    expect(typeof navigationModule.redirect).toBe('function');
    expect(typeof navigationModule.usePathname).toBe('function');
    expect(typeof navigationModule.useRouter).toBe('function');
    expect(typeof navigationModule.getPathname).toBe('function');
  });
});
