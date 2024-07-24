"use client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };
  return (
    <Button variant="destructive" onClick={signOut}>
      Logout
    </Button>
  );
}
