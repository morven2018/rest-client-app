import CustomSidebar from '@/components/layout/sidebar/sidebar';
import EnvHeading from '@/components/layout/variables/env-heading';
import EnvironmentVariablesTable from '@/components/layout/variables/env-content';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function VariablePage() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('authToken')?.value;
  if (!authToken) redirect('/');
  return (
    <main>
      <CustomSidebar className="min-h-120">
        <Heading>
          <EnvHeading />
        </Heading>
        <EnvironmentVariablesTable />
      </CustomSidebar>
    </main>
  );
}
