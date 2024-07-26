"use client";
import { ExternalLink } from "@/components/external-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  api_key: z.string().min(2, {
    message: "API Key must be at least 2 characters.",
  }),
});

export default function AI() {
  const { toast } = useToast();
  const [APIToken, setAPIToken] = useLocalStorage<string | null>(
    "ai-token",
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_key: "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  useEffect(() => {
    if (APIToken) {
      form.reset({ api_key: APIToken });
    }
  }, [APIToken, form]);

  const clearKey = () => {
    try {
      setAPIToken(null);
      form.reset({ api_key: "" });
      toast({ description: "Key cleared successfully" });
    } catch (error) {
      console.error("Failed to clear key from localStorage:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Failed to clear key from localStorage.",
      });
    }
  };

  const checkOpenAIKey = async (key: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/verifyKey", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
          ContentType: "application/json",
        },
      });
      if (response.status === 401) {
        throw new Error("Invalid OpenAI API key.");
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const save = async (values: z.infer<typeof formSchema>) => {
    try {
      const isValid = await checkOpenAIKey(values.api_key);
      if (!isValid) {
        throw new Error("Invalid OpenAI API key.");
      }
      setAPIToken(values.api_key);

      toast({ description: "Key verified and saved successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Invalid OpenAI API Key",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Enter" || e.key === "NumpadEnter")
    ) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Open AI Key</CardTitle>
          <CardDescription className="text-green-800 italic">
            One key to rule them all, one key to bind them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(save)} className="space-y-8">
              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input placeholder="sk-...XXX" {...field} required />
                    </FormControl>
                    <FormDescription>
                      Please enter your OpenAI API Key above. You can create
                      your API key{" "}
                      <ExternalLink href="https://platform.openai.com/api-keys">
                        here
                      </ExternalLink>
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
              ) : (
                <Button type="submit" onKeyDown={handleKeyDown}>
                  Verify
                </Button>
              )}
            </form>
          </Form>
          <Button variant="destructive" className="mt-4" onClick={clearKey}>
            Clear Key
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
