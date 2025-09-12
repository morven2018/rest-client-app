import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';

export default function VariablesPage() {
  return (
    <main>
      <CustomSidebar className="min-h-150">
        <Heading>
          <div className="min-h-150">This is Variables page</div>
        </Heading>
      </CustomSidebar>
    </main>
  );
}
