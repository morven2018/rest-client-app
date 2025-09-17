import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FormWrapper } from "@/components/layout/form/form-wrapper";
import { FormTab } from "@/components/layout/form/tabs";

export default async function LogInPage() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('authToken')?.value;

  if (authToken) redirect('/');

  return (
    <main>
      <FormWrapper requireUnauth={true}>
        <FormTab searchParams={'login'} />
      </FormWrapper>
    </main>
  );
}
