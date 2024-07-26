import "server-only";
import { Database } from "@/lib/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "@/lib/utils";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@/utils/supabase/server";
import { streamText } from "ai";

export async function POST(req: Request, res: Response) {
  const supabase: SupabaseClient<Database> = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const json = await req.json();
  const { messages, key } = json;
  const userId = user.id;

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const openai = createOpenAI({
    apiKey: key,
    compatibility: "strict",
  });

  const model = openai("gpt-4o-mini");

  const result = await streamText({
    model,
    messages,
    onFinish: async (result) => {
      const title = result.text.substring(0, 100);
      const id = json.id ?? nanoid();
      const createdAt = Date.now();
      const path = `/dashboard/mainframe/${id}`;
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: result.text,
            role: "assistant",
            usage: result.usage,
          },
        ],
      };
      // Insert chat into database.
      await supabase
        .from("chats")
        .upsert({ id, user_id: userId, payload })
        .throwOnError();
    },
  });

  return result.toAIStreamResponse();
}
