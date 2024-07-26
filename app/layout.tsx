import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "LearnTerminal",
  description: "Learn new things in the terminal and test them on the fly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <TooltipProvider>
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
