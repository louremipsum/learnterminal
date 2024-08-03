"use server";
import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/types/supabase";
import { revalidatePath } from "next/cache";
import { permanentRedirect, redirect } from "next/navigation";
import { type Chat } from "@/lib/types/types";
import { generateToken } from "@/lib/utils";

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

export async function getChatUserInfo(userId: string, chatId: string) {
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    const { data } = await supabase
      .from("user_info")
      .select("*")
      .eq("user_id", userId)
      .eq("chat_id", chatId)
      .maybeSingle();
    return data ?? null;
  } catch (e) {
    return null;
  }
}

export async function postChatUserInfo(
  userId: string,
  chatId: string,
  data: Record<string, string>
) {
  const supabase: SupabaseClient<Database> = await createClient();
  const { error } = await supabase
    .from("user_info")
    .upsert({ ...data, user_id: userId, chat_id: chatId });
  if (error) throw error;
  return permanentRedirect(`/dashboard/mainframe/${chatId}`);
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("chats")
      .delete()
      .eq("user_id", user!.id)
      .throwOnError();
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("clear chats error: ", error);
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

export async function getWSURL(userId: string) {
  const token = generateToken(userId);
  try {
    const response = await fetch(`${process.env.SERVER_URL}/start-container`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return data.url;
  } catch (e) {
    console.error(e);
    const response = await fetch(`${process.env.SERVER_URL}/stop-container`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    const resp = await response.json();
  }
}

export async function closeContainer(userId: string) {
  const token = generateToken(userId);
  try {
    const response = await fetch(`${process.env.SERVER_URL}/stop-container`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    // revalidatePath("/dashboard/mainframe");
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
