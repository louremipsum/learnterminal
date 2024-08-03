import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "LearnTerminal",
  description: "Learn new things in the terminal and test them on the fly.",
  openGraph: {
    title: "LearnTerminal",
    description: "Learn new things in the terminal and test them on the fly.",
    url: "https://learnterminal.vercel.app/",
    siteName: "LearnTerminal",
    images: [
      {
        url: "https://github.com/louremipsum/learnterminal/blob/master/public/image.png?raw=true",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnTerminal",
    description: "Learn new things in the terminal and test them on the fly.",
    siteId: "1467726470533754880",
    creator: "@louremipsum",
    creatorId: "1467726470533754880",
    images: [
      "https://github.com/louremipsum/learnterminal/blob/master/public/image.png?raw=true",
    ],
  },
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
          <Toaster richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
