import CustomSidebar from '@/components/layout/sidebar/sidebar';
import EnvHeading from '@/components/layout/variables/env-heading';
import EnvironmentVariablesTable from '@/components/layout/variables/env-content';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';

export default function VariablePage() {
  return (
    <main>
      <CustomSidebar className="min-h-150">
        <Heading>
          <EnvHeading />
        </Heading>
        <EnvironmentVariablesTable />
      </CustomSidebar>
    </main>
  );
}
