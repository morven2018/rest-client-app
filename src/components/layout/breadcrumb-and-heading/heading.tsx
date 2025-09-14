'use client';
import CustomBreadcrumb from './breadcrumb';
import { usePathname } from '@/i18n/navigation';

interface HeadingProps {
  children: React.ReactNode;
}
export default function Heading({ children }: Readonly<HeadingProps>) {
  const pathname = usePathname();
  return (
    <div>
      <CustomBreadcrumb pathname={pathname} />
      {children}
    </div>
  );
}
