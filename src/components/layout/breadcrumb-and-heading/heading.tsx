import CustomBreadcrumb from './breadcrumb';

interface HeadingProps {
  children: React.ReactNode;
}
export default function Heading({ children }: Readonly<HeadingProps>) {
  return (
    <div>
      <CustomBreadcrumb />

      {children}
    </div>
  );
}
