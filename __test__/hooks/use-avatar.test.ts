import { act, renderHook } from '@testing-library/react';
import { toastError } from '@/components/ui/sonner';
import { useAuth } from '@/context/auth/auth-context';
import { useAvatar } from '@/hooks/use-avatar';

jest.mock('@/context/auth/auth-context');
jest.mock('@/components/ui/sonner', () => ({
  toastError: jest.fn(),
}));

describe('useAvatar', () => {
  const mockGetAvatar = jest.fn();
  const mockCurrentUser = { uid: 'test-uid' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
      getAvatar: mockGetAvatar,
    });
  });

  it('set initial state', () => {
    const { result } = renderHook(() => useAvatar());

    expect(result.current.loading).toBe(true);
    expect(result.current.avatarUrl).toBe('');
  });

  it('load avatar if currentUser exists', async () => {
    const mockAvatarBase64 = 'base64-string';
    mockGetAvatar.mockResolvedValue(mockAvatarBase64);

    const { result } = renderHook(() => useAvatar());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockGetAvatar).toHaveBeenCalledWith('test-uid');
    expect(result.current.avatarUrl).toBe(
      `data:image/jpeg;base64,${mockAvatarBase64}`
    );
    expect(result.current.loading).toBe(false);
  });

  it('handle empty avatar', async () => {
    mockGetAvatar.mockResolvedValue('');

    const { result } = renderHook(() => useAvatar());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.avatarUrl).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('handle errors on loading an avatar', async () => {
    mockGetAvatar.mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useAvatar());

    await act(async () => {
      await Promise.resolve();
    });

    expect(toastError).toHaveBeenCalledWith(
      'Error fetching avatar',
      expect.objectContaining({
        additionalMessage: 'Failed to fetch',
        duration: 3000,
      })
    );
    expect(result.current.avatarUrl).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('clear the avatar if currentUser is missing', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: null,
      getAvatar: mockGetAvatar,
    });

    const { result } = renderHook(() => useAvatar());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockGetAvatar).not.toHaveBeenCalled();
    expect(result.current.avatarUrl).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('update the avatar using updateAvatar', async () => {
    mockGetAvatar.mockResolvedValue('initial-avatar');
    const { result } = renderHook(() => useAvatar());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const newAvatarBase64 = 'data:image/jpeg;base64,new-avatar-data';

    await act(async () => {
      result.current.updateAvatar(newAvatarBase64);
    });

    expect(result.current.avatarUrl).toBe('new-avatar-data');
  });

  it('clear the avatar using clearAvatar', async () => {
    mockGetAvatar.mockResolvedValue('some-avatar');
    const { result } = renderHook(() => useAvatar());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.avatarUrl).not.toBe('');

    act(() => {
      result.current.clearAvatar();
    });

    expect(result.current.avatarUrl).toBe('');
  });

  it('reload the avatar when currentUser changes', async () => {
    const { rerender } = renderHook(() => useAvatar());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockGetAvatar).toHaveBeenCalledTimes(1);

    const newUser = { uid: 'new-uid' };
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: newUser,
      getAvatar: mockGetAvatar,
    });

    rerender();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockGetAvatar).toHaveBeenCalledTimes(2);
    expect(mockGetAvatar).toHaveBeenCalledWith('new-uid');
  });
});
