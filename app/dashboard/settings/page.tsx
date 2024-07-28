import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";

export default async function SettingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
          <CardDescription>
            Your name as it appears on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="Name" value={user?.user_metadata.first_name} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Your email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="Email" value={user?.email} />
        </CardContent>
      </Card>
    </div>
  );
}
