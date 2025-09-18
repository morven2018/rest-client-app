import CustomSidebar from '@/components/layout/sidebar/sidebar';
import Team from '@/components/layout/team/team';
import GreetingsSection from '@/components/layout/greetings/Greetings';

export default function Home() {
  return (
    <>
      <CustomSidebar className="min-h-120">ввы</CustomSidebar>
      <GreetingsSection />
      <Team />
    </>
  );
}
