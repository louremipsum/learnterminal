import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { getChat, getChatUserInfo } from "@/app/actions";
import { Chat } from "@/components/chat/chat";
import { createClient } from "@/utils/supabase/server";
import { MainframeLayout } from "@/components/MainframeLayout";
import { Message } from "ai";
import getPrompt from "@/lib/prompt";
import { LoaderIcon } from "lucide-react";
import dynamic from "next/dynamic";
const Terminal = dynamic(
  async () => (await import("@/components/Terminal")).default,
  { ssr: false, loading: () => <LoaderIcon className="animate-spin" /> }
);

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }

  const chat = await getChat(params.id);
  return {
    title: chat?.title.toString().slice(0, 50) ?? "New Chat",
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard`);
  }

  const chat = await getChat(params.id);
  const ChatUserInfo = await getChatUserInfo(user.id, params.id);
  const data = {
    proficiency_level: ChatUserInfo?.proficiency_level ?? "",
    learning_objective: ChatUserInfo?.learning_objective ?? "",
    learning_style: ChatUserInfo?.learning_style ?? "",
    os_familiarity: ChatUserInfo?.os_familiarity ?? "",
    preferred_language: ChatUserInfo?.preferred_language ?? "",
    use_case: ChatUserInfo?.use_case ?? "",
    feedback_preferences: ChatUserInfo?.feedback_preferences ?? "",
  };

  if (!chat && !ChatUserInfo) {
    const param = new URLSearchParams({ userId: user.id, chatId: params.id });
    redirect(`/dashboard/ask?${param}`);
  }

  const id = chat ? chat.id : params.id;
  const messages = chat
    ? chat.messages
    : ([
        {
          role: "system",
          content: getPrompt({ ...data, name: user.user_metadata.first_name }),
        },
      ] as Message[]);

  return (
    <MainframeLayout
      chat={<Chat id={id} initialMessages={messages} />}
      terminal={<Terminal userId={user.id} />}
    />
  );
}
