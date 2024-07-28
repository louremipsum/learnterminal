import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import NewChat from "@/components/chat/NewChat";
import Footer from "@/components/Footer";
import { SidebarList } from "@/components/chat/sidebar-list";

export default async function ProtectedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <section className=" flex my-auto">
        <aside className="w-1/2 h-full my-auto mx-16">
          <p className="text-xl text-bold text-green-900 my-3">
            Welcome to the mainframe👋
          </p>
          <p>Start a new session or join an exisiting one</p>
        </aside>
        <main>
          <div className="h-full w-1/2 my-auto">
            <SidebarList userId={user.id} />
          </div>
          <NewChat userId={user.id} />
        </main>
      </section>
      <Footer />
    </div>
  );
}
