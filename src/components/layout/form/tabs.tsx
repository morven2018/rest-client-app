import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TabsDemoProps {
  searchParams: string;
}

export function FormTab({ searchParams }: Readonly<TabsDemoProps>) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue={searchParams}>
        <TabsList>
          {' '}
          <Link href="/login">
            <TabsTrigger value="login">LOG IN</TabsTrigger>
          </Link>
          <Link href="/register">
            <TabsTrigger value="register">Register</TabsTrigger>
          </Link>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>LOG IN</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              To get access login or
              <Link href="/register">register</Link>, if you have no account
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardFooter>
              To get access
              <Link href="/login">login</Link>
              or register, if you already have an account
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
