import { render, screen } from '@testing-library/react';
import { FormWrapper } from '@/components/layout/form/form-wrapper';
import { useAuth } from '@/context/auth/auth-context';
import { useRouter } from '@/i18n/navigation';

jest.mock('@/context/auth/auth-context');
jest.mock('@/i18n/navigation');

describe('FormWrapper', () => {
  const mockRouterPush = jest.fn();
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
  });

  it('render children when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ authToken: null, currentUser: null });

    render(
      <FormWrapper>
        <div data-testid="test-child">Test Content</div>
      </FormWrapper>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('not render children and redirects when user is authenticated and requireUnauth=true', () => {
    mockUseAuth.mockReturnValue({
      authToken: 'test-token',
      currentUser: { id: 1, name: 'Test User' },
    });

    render(
      <FormWrapper requireUnauth={true}>
        <div data-testid="test-child">Test Content</div>
      </FormWrapper>
    );

    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('render children when user is authenticated and requireUnauth=false', () => {
    mockUseAuth.mockReturnValue({
      authToken: 'test-token',
      currentUser: { id: 1, name: 'Test User' },
    });

    render(
      <FormWrapper requireUnauth={false}>
        <div data-testid="test-child">Test Content</div>
      </FormWrapper>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
