import { type Message } from "ai";

// TODO refactor and remove unneccessary duplicate data.
export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export type ServerActionResult<T> = Promise<
  | T
  | {
      error: string;
    }
>;
