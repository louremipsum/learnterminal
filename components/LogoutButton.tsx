import { signOut } from "@/app/action";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button variant="destructive" onClick={signOut}>
      Logout
    </Button>
  );
}
