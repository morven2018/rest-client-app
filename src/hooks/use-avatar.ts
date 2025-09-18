import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth/auth-context';

export function useAvatar() {
  const { currentUser, getAvatar } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (currentUser?.uid) {
        try {
          setLoading(true);
          const avatarBase64 = await getAvatar(currentUser.uid);

          if (avatarBase64 && avatarBase64.trim() !== '') {
            const dataUrl = `data:image/jpeg;base64,${avatarBase64}`;
            setAvatarUrl(dataUrl);
          } else {
            setAvatarUrl('');
          }
        } catch (error) {
          console.error('Error fetching avatar:', error);
          setAvatarUrl('');
        } finally {
          setLoading(false);
        }
      } else {
        setAvatarUrl('');
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [currentUser, getAvatar]);

  const updateAvatar = async (base64String: string) => {
    if (currentUser?.uid && base64String)
      setAvatarUrl(base64String.replace(/^data:image\/\w+;base64,/, ''));
  };

  const clearAvatar = () => {
    setAvatarUrl('');
  };

  return { avatarUrl, loading, updateAvatar, clearAvatar };
}
