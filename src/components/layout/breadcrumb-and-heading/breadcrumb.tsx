import { Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { formatBreadcrumbName } from '@/lib/formatter';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface CustomBreadcrumbProps {
  pathname: string;
}

export default function CustomBreadcrumb({
  pathname,
}: Readonly<CustomBreadcrumbProps>) {
  const links = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className="py-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            className="text-neutral-800 dark:text-neutral-100"
          >
            <Link href="/">
              <Home width="20px" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {links.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {links.length === 1 ? (
                <BreadcrumbPage className="text-violet-900 dark:text-violet-500">
                  {formatBreadcrumbName(links[0])}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="text-neutral-800 dark:text-neutral-100"
                >
                  <Link href={`/${links[0]}`}>
                    {formatBreadcrumbName(links[0])}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}

        {links.length === 2 && links[0] === 'variables' && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-violet-900 dark:text-violet-500">
                {formatBreadcrumbName(links[1])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
