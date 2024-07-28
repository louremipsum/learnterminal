"use client";
import { useChat, type Message } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat/chat-list";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatScrollAnchor } from "@/components/chat/chat-scroll-anchor";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ExternalLink } from "../external-link";
import { ScrollArea } from "../ui/scroll-area";
import { ButtonScrollToBottom } from "./button-scroll-to-bottom";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [key, setKey] = useLocalStorage<string | null>("ai-token", null);
  const [keyAlertDialog, setKeyAlertDialog] = useState<boolean>(!key);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (key) {
      setKeyAlertDialog(false);
    }
  }, [key]);
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        key,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });
  return (
    <div className={`flex flex-col h-screen ${className}`}>
      <div className="flex-grow overflow-hidden mt-4">
        <ScrollArea className="h-full" ref={ref}>
          {messages.length > 0 && (
            <>
              <ChatList messages={messages} />
              <ChatScrollAnchor trackVisibility={isLoading} refValue={ref} />
            </>
          )}
        </ScrollArea>
      </div>
      <ButtonScrollToBottom scrollRef={ref} />
      <div className="flex justify-center items-center h-1/2">
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
        />
      </div>
      <AlertDialog open={keyAlertDialog} onOpenChange={setKeyAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter your OpenAI Key</AlertDialogTitle>
            <AlertDialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{" "}
              <ExternalLink href="https://platform.openai.com/signup/">
                signing up
              </ExternalLink>
              on the OpenAI website. The token will be saved to your
              browser&apos;s local storage under the name{" "}
              <code className="font-mono">ai-token</code>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link
              href={"/dashboard/settings/ai"}
              className="text-green-500 underline"
            >
              <Button color="green" variant={"default"}>
                Settings
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
