import { nanoid } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import Link from "next/link";

const NewChat = ({ userId }: { userId: string }) => {
  const id = nanoid();

  return (
    <Link
      href={{
        pathname: "/dashboard/ask",
        query: { userId: userId, chatId: id },
      }}
      prefetch={false}
    >
      <Card className="rounded-lg bg-green-50 text-slate-800 mx-auto min-w-3/4">
        <CardHeader className="drop-shadow-glow">
          <CardTitle>
            <div className="flex items-center">
              <span className="animate-pulse text-xl text-green-600 mr-2">
                &gt;
              </span>
              New
            </div>
          </CardTitle>
          <CardDescription>Start a new learning session</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default NewChat;
