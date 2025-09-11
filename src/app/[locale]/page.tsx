'use client';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth/auth-context';
import TeamMembers from '@/components/ui/team';

export default function Home() {
  const t = useTranslations('Header');
  const { currentUser, authToken, getAvatar } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    const fetchAvatar = async () => {
      if (currentUser) {
        try {
          const avatarBase64 = await getAvatar(currentUser.uid);
          if (avatarBase64) {
            setAvatarUrl(avatarBase64);
          } else {
            setAvatarUrl('');
          }
        } catch {
          setAvatarUrl('');
        }
      }
    };

    fetchAvatar();
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [currentUser, getAvatar, avatarUrl]);

  return (
    <>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <h1>{t('hello')}</h1>

        {authToken && currentUser && (
          <div>
            <Avatar>
              <AvatarImage
                src={avatarUrl.replaceAll('"', '')}
                alt="User Avatar"
                className="object-cover"
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>

            <h2>{currentUser.displayName}</h2>
          </div>
        )}
      </div>
      <TeamMembers />
    </>
  );
}
