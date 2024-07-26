import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/Footer";
import Logo from "@/components/ui/Logo";

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

      <main className="w-3/4 m-auto">
        <p className="text-xl text-bold text-green-900 ">
          Welcome to the Mainframe
        </p>
        <p>Learn terminal commands with AI and test them on the fly</p>
      </main>

      <Footer />
    </div>
  );
}
