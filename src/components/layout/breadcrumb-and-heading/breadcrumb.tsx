'use client';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CustomBreadcrumb() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const links = isClient ? pathname.split('/').filter(Boolean) : [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Breadcrumb className="px-4 py-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            className="text-neutral-800 dark:text-neutral-100"
          >
            <Link href={`/`}>
              <Home width="20px" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {isClient && !!links.length && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {links.length < 2 && (
                <BreadcrumbPage
                  className={'text-violet-900 dark:text-violet-500'}
                >
                  {links[0].replace(links[0][0], links[0][0].toUpperCase())}
                </BreadcrumbPage>
              )}

              {links.length >= 2 && (
                <BreadcrumbLink
                  asChild
                  className={'text-neutral-800 dark:text-neutral-100'}
                >
                  <Link href={`/${links[0]}`}>
                    {links[0].replace(links[0][0], links[0][0].toUpperCase())}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}

        {isClient && links.length === 2 && links[0] === 'variables' && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage
                className={'text-violet-900 dark:text-violet-500'}
              >
                {links[1].replace(links[1][0], links[1][0].toUpperCase())}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
