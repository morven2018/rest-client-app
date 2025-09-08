'use client';
import { Home } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CustomBreadcrumb() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const locale = useLocale();
  const links = isClient ? pathname.split('/').filter(Boolean) : [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getLocalizedPath = (segmentIndex: number): string => {
    const pathSegments = links.slice(0, segmentIndex + 1);
    return `/${locale}/${pathSegments.join('/')}`;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/${locale}`}>
            <Home width="20px" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {isClient && !!links.length && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={getLocalizedPath(0)}
                className={`${links.length < 2 && 'text-violet-900'}`}
              >
                {links[0].replace(links[0][0], links[0][0].toUpperCase())}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {isClient && links.length === 2 && links[0] === 'variables' && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={getLocalizedPath(1)}
                className={'text-violet-900'}
              >
                {links[1].replace(links[1][0], links[1][0].toUpperCase())}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
