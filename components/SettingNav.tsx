"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingNav() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      <Link
        href="/dashboard/settings"
        className={`text-primary ${
          pathname == "/dashboard/settings" ? "font-semibold" : ""
        }`}
      >
        General
      </Link>
      <Link
        href="/dashboard/settings/ai"
        className={`text-primary ${
          pathname == "/dashboard/settings/ai" ? "font-semibold" : ""
        }`}
      >
        Open AI
      </Link>
    </nav>
  );
}
