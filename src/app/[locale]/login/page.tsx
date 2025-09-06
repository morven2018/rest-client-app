import { FormWrapper } from '@/components/layout/form/form-wrapper';
import { FormTab } from '@/components/layout/form/tabs';

export default function LogInPage() {
  return (
    <main>
      <FormWrapper requireUnauth={true}>
        <FormTab searchParams={'login'} />
      </FormWrapper>
    </main>
  );
}
