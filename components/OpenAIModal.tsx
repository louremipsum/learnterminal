"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  api_key: z.string().min(2, {
    message: "API Key must be at least 2 characters.",
  }),
});

// type ModalProps = {
//   keyInfoHandler: (key: string, disable: boolean) => void;
// };

const OpenAIModal = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const getKey = JSON.parse(localStorage.getItem("items")!);
      return getKey && getKey.length > 0 ? getKey[0] : "";
    }
    return "";
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_key: key,
    },
  });

  const clearKey = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("items");
        setKey("");
        // keyInfoHandler(key, true);
        toast({
          variant: "default",
          title: "Key cleared successfully.",
          description: "Key cleared successfully.",
        });
      }
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
      if (typeof window !== "undefined") {
        localStorage.setItem("items", JSON.stringify([values.api_key]));
        // keyInfoHandler(values.api_key, false);
      }
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OpenAI Key</DialogTitle>
          <DialogDescription>
            Please enter your OpenAI API Key below. You can create your API key{" "}
            <a
              href="https://platform.openai.com/api-keys"
              className="text-slate-500 font-medium"
              target="_blank"
            >
              here
            </a>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(save)} className="space-y-8">
            <FormField
              control={form.control}
              name="api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="sk-...XXX" {...field} />
                  </FormControl>
                  <FormDescription>
                    This key will be used to authenticate with OpenAI.
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
      </DialogContent>
    </Dialog>
  );
};

export default OpenAIModal;
