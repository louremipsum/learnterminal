"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getChatUserInfo, postChatUserInfo } from "@/app/actions";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const FormSchema = z.object({
  proficiency_level: z
    .string()
    .min(1, { message: "Proficiency level is required." }),
  learning_objective: z
    .string()
    .min(1, { message: "Learning objective is required." }),
  learning_style: z.string().min(1, { message: "Learning style is required." }),
  os_familiarity: z.string().min(1, { message: "OS familiarity is required." }),
  preferred_language: z
    .string()
    .min(1, { message: "Preferred programming language is required." }),
  use_case: z.string().min(1, { message: "Use case is required." }),
  feedback_preferences: z
    .string()
    .min(1, { message: "Feedback preferences are required." }),
});

function UserForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const chatId = searchParams.get("chatId");
  if (!userId && !chatId) {
    router.replace("/dashboard");
  }
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: async () => {
      const chatUserInfo = await getChatUserInfo(userId!, chatId!);
      return {
        proficiency_level: chatUserInfo?.proficiency_level ?? "",
        learning_objective: chatUserInfo?.learning_objective ?? "",
        learning_style: chatUserInfo?.learning_style ?? "",
        os_familiarity: chatUserInfo?.os_familiarity ?? "",
        preferred_language: chatUserInfo?.preferred_language ?? "",
        use_case: chatUserInfo?.use_case ?? "",
        feedback_preferences: chatUserInfo?.feedback_preferences ?? "",
      };
    },
  });

  async function postInfo(data: z.infer<typeof FormSchema>) {
    try {
      await postChatUserInfo(userId!, chatId!, data);
      toast({
        title: "Information submitted successfully",
        description: "Now that I know you, I can teach you better!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "An error occured while submitting your information. Please try again later.",
        variant: "destructive",
      });
      //   throw new Error((error as Error).message);
    }
  }

  return (
    <div className="flex-1 flex flex-col w-screen px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>
      <section className="mt-32 mb-10 flex items-center justify-center">
        <div>
          <span className="animate-pulse text-3xl text-green-600 mr-2">
            &gt;
          </span>
          <span className="text-3xl text-slate-700 font-semibold">
            Let&apos;s get to know you first
          </span>
        </div>
      </section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(postInfo)}
          className="space-y-6 flex justify-center flex-col gap-4 mb-8"
        >
          <FormField
            control={form.control}
            name="proficiency_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proficiency Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Proficiency Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your current proficiency with Linux commands.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="learning_objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Learning Objective</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., basic navigation" {...field} />
                </FormControl>
                <FormDescription>
                  What are your main goals for learning terminal commands?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="learning_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Learning Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Learning Style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Detailed Explanations">
                      Detailed Explanations
                    </SelectItem>
                    <SelectItem value="Quick Instructions">
                      Quick Instructions
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Do you prefer detailed explanations or quick, concise
                  instructions?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="os_familiarity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operating System Familiarity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OS Familiarity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Linux">Linux</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Which operating system are you most familiar with?(Sorry but
                  only linux is currently supported yet🙇)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferred_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Programming Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Preferred Language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bash">Bash</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  If you are interested in scripting, which programming language
                  do you prefer?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="use_case"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Use Case</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Use Case" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="professional development">
                      Professional Development
                    </SelectItem>
                    <SelectItem value="hobby projects">
                      Hobby Projects
                    </SelectItem>
                    <SelectItem value="academic purposes">
                      Academic Purposes
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  For what are you learning terminal commands for?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="feedback_preferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Preferences</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Feedback Preferences" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Instant Feedback">
                      Instant Feedback
                    </SelectItem>
                    <SelectItem value="Batch Feedback">
                      Batch Feedback
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Do you prefer receiving instant feedback on your commands or
                  after completing a series of tasks?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function UserFormComp() {
  return (
    <Suspense>
      <UserForm />
    </Suspense>
  );
}
