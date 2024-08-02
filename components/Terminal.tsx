"use client";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import AttachAddon from "@/lib/CustomAddon";
import { closeContainer, getWSURL } from "@/app/actions";
import { LoaderCircle, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog";

export default function XTerm({ userId }: { userId: string }) {
  const xtermRef = useRef<HTMLDivElement | null>(null);
  const xterm = useRef<Terminal | null>(null);
  const [socketURL, setSocketURL] = useState("");
  const [didURLCome, setDidURLCome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function deleteTerminal(userId: string) {
    setIsLoading(true);
    try {
      toast.promise(closeContainer(userId), {
        loading: "Deleting Terminal...",
        success: "Successfully deleted the terminal",
        error: "Error",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function getURL(userId: string) {
      try {
        const url = await getWSURL(userId);
        setSocketURL(url);
        setDidURLCome(true);
      } catch (e) {
        console.error(e);
      }
    }
    getURL(userId);
  }, [userId, socketURL]);

  useEffect(() => {
    if (xtermRef.current && didURLCome && socketURL) {
      xterm.current = new Terminal();
      xterm.current.open(xtermRef.current);
      // const fitAddon = new FitAddon();
      // xterm.current.loadAddon(fitAddon);
      const socket = new WebSocket(socketURL);
      console.log(socket);
      const attachAddon = new AttachAddon(socket);
      xterm.current.loadAddon(attachAddon);

      return () => {
        if (xterm.current) {
          xterm.current.dispose();
        }
      };
    }
  }, [socketURL]);

  return (
    <div>
      <div className="h-[90vh] m-3 rounded-lg overflow-hidden p-2 bg-black">
        <div ref={xtermRef} className="overflow-x-hidden" />
        {!didURLCome && (
          <div className="text-center text-white">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
      </div>
      <div className="m-auto w-[90%] flex justify-around items-center border border-slate-400 rounded-2xl">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="rounded-lg">
              <RefreshCcw
                className="size-4"
                onClick={() => {
                  setSocketURL("");
                  setDidURLCome(false);
                }}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reload the terminal</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/dashboard"}>
              <Button variant={"ghost"} className=" rounded-lg">
                <span className="animate-pulse text-lg text-green-600 mr-2">
                  &gt;
                </span>
                <code>cd dashboard</code>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go Back to Dashboard</p>
          </TooltipContent>
        </Tooltip>

        <Sheet>
          <SheetTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} className="rounded-lg">
                  <span className="animate-pulse text-lg text-green-600 mr-2">
                    &gt;
                  </span>
                  <code>sudo ./settings</code>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings of Terminal</p>
              </TooltipContent>
            </Tooltip>
          </SheetTrigger>
          <SheetContent side={"bottom"} className="h-1/4 sm:h-1/2">
            <SheetHeader>
              <SheetTitle>About the Terminal</SheetTitle>
              <SheetDescription>
                <div className="my-2">
                  This Terminal is a secure environment for you to run your code
                  and test your applications. You can run any command here and
                  see the output in real-time.
                </div>
                <div>
                  This Terminal is yours and we expect you to take care of it as
                  you would with your own computer(or not, we don't care). The
                  terminal will be shared among all your chats and if you want
                  you can close the terminal and get a new one.
                </div>
                <div className=" italic text-slate-500 m-4">
                  This terminal experience is brought to you by xterm
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="h-8">
                      Delete Terminal
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your data from the terminal and you will be given
                        a new machine
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isLoading}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          await deleteTerminal(userId);
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
