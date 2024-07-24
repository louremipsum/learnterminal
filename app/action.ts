"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export { signOut };
