import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Heading from '@/components/layout/breadcrumb-and-heading/heading';
import HistoryHeading from '@/components/layout/history/history-heading';

export default function HistoryAndAnalyticsPage() {
  return (
    <main>
      <CustomSidebar className="min-h-120">
        <Heading>
          <HistoryHeading />
          <div>This is History and analytics page</div>
        </Heading>
      </CustomSidebar>
    </main>
  );
}
