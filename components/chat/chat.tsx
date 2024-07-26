"use client";
import { useChat, type Message } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat/chat-list";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatScrollAnchor } from "@/components/chat/chat-scroll-anchor";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ExternalLink } from "../external-link";
import { ScrollArea } from "../ui/scroll-area";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [key, setKey] = useLocalStorage<string | null>("ai-token", null);
  const [keyDialog, setKeyDialog] = useState<boolean>(!key);
  useEffect(() => {
    if (key) {
      setKeyDialog(false);
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
    <div className="">
      {/* <ScrollArea className="h-screen"> */}
      <div className={cn("pb-[100px] pt-4 md:pt-10", className)}>
        {messages.length && (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        )}
      </div>
      {/* </ScrollArea> */}
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

      <Dialog open={keyDialog} onOpenChange={setKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{" "}
              <ExternalLink href="https://platform.openai.com/signup/">
                signing up
              </ExternalLink>
              on the OpenAI website. The token will be saved to your
              browser&apos;s local storage under the name{" "}
              <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link
              href={"/dashboard/settings/ai"}
              className="text-green-500 underline"
            >
              <Button color="green" variant={"default"}>
                Settings
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
