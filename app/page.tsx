import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/Footer";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { TerminalIcon } from "@/components/ui/icons";
import Image from "next/image";

export default async function Index() {
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Logo />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {isSupabaseConnected && <AuthButton />}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-10 md:py-24 lg:py-16 xl:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Master Terminal Commands with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Learn terminal commands with Mainframe with ease and just
                    test them on the fly
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-green-400 px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-green-700/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="bg-green-100 rounded-xl p-6 shadow-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="bg-background rounded-md p-4 shadow-sm w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TerminalIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Terminal</span>
                      </div>
                      <div className="flex items-center gap-2"></div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>$ ls -l</p>
                      <p>$ cd documents</p>
                      <p>$ mkdir new_folder</p>
                      <p>$ touch new_file.txt</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Practice terminal commands in the interactive window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full my-24 py-10 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Learn Terminal Commands with Ease
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered application provides a live practice terminal,
                  and a knowledgeable chatbot to help you master terminal
                  commands.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Containerized Environment
                  </h3>
                  <p className="text-muted-foreground">
                    Your terminal is isolated so even if you mess up something,
                    you can just restart the terminal and it will be a new
                    machine
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Live Practice Terminal</h3>
                  <p className="text-muted-foreground">
                    Reinforce your learning by practicing terminal commands in a
                    live, interactive environment.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">AI Chatbot Assistant</h3>
                  <p className="text-muted-foreground">
                    Get instant help and guidance from our knowledgeable AI
                    chatbot, answering your questions and providing additional
                    resources.
                  </p>
                </div>
              </div>
              <Image
                src={"/SS.png"}
                width="959"
                height="433"
                alt="Demo"
                className="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
