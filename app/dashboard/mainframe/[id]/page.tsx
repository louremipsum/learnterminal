import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getChat } from "@/app/actions";
import { Chat } from "@/components/chat/chat";
import { createClient } from "@/utils/supabase/server";
import { MainframeLayout } from "@/components/MainframeLayout";

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

function Terminal() {
  return <div>FRom TErminal</div>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }

  if (!user) {
    redirect(`/sign-in?next=/dashboard/mainframe/${params.id}`);
  }

  const chat = await getChat(params.id);
  // if (!chat) {
  //   return (
  //     <MainframeLayout chat={<Chat id={params.id} />} terminal={<Terminal />} />
  //   );
  // }

  // if (chat?.userId !== user?.id) {
  //   notFound();
  // }
  const id = chat ? chat.id : params.id;
  const messages = chat ? chat.messages : [];

  return (
    <MainframeLayout
      chat={<Chat id={id} initialMessages={messages} />}
      terminal={<Terminal />}
    />
  );
}
