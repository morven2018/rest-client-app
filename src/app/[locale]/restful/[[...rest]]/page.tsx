import RestfulContent from './content';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RestfulPage() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('authToken')?.value;
  if (!authToken) redirect('/');

  return <RestfulContent />;
}
