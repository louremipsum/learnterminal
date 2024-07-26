"use server";
import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/types/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type Chat } from "@/lib/types/types";

export async function getChats(userId?: string | null) {
  if (!userId) {
    return [];
  }
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    const { data } = await supabase
      .from("chats")
      .select("payload")
      .order("payload->createdAt", { ascending: false })
      .eq("user_id", userId)
      .throwOnError();

    return (data?.map((entry) => entry.payload) as Chat[]) ?? [];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string) {
  const supabase: SupabaseClient<Database> = await createClient();
  const { data } = await supabase
    .from("chats")
    .select("payload")
    .eq("id", id)
    .maybeSingle();

  return (data?.payload as Chat) ?? null;
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    await supabase.from("chats").delete().eq("id", id).throwOnError();

    revalidatePath("/dashboard");
    return redirect("/dashboard");
    // return revalidatePath(path);
  } catch (error) {
    return {
      error: "Unauthorized",
    };
  }
}

export async function clearChats() {
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    await supabase.from("chats").delete().throwOnError();
    revalidatePath("/dashboard");
    return redirect("/dashboard");
  } catch (error) {
    console.log("clear chats error", error);
    return {
      error: "Unauthorized",
    };
  }
}

export async function getSharedChat(id: string) {
  const supabase: SupabaseClient<Database> = await createClient();
  const { data } = await supabase
    .from("chats")
    .select("payload")
    .eq("id", id)
    .not("payload->sharePath", "is", null)
    .maybeSingle();

  return (data?.payload as Chat) ?? null;
}

export async function shareChat(id: string) {
  const supabase: SupabaseClient<Database> = await createClient();
  const chat = await getChat(id);

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  };

  await supabase
    .from("chats")
    .update({ payload: payload as any })
    .eq("id", chat.id)
    .throwOnError();

  return payload;
}
