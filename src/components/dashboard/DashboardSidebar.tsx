"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  Settings,
  Award,
  LayoutTemplate,
  LogOut,
  Layers,
  Puzzle,
  Briefcase,
} from "lucide-react";
import { SpiderLogo } from "@/components/spider-logo";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/sections", label: "Sections", icon: Layers },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/customize", label: "Customize", icon: Palette },
  { href: "/dashboard/widgets", label: "Widgets", icon: Puzzle },
  { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/badges", label: "Badges", icon: Award },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const identities = data.user.identities ?? [];
        const discordIdent = identities.find((i) => i.provider === "discord");
        const name =
          discordIdent?.identity_data?.username as string | undefined ??
          data.user.user_metadata?.full_name ??
          data.user.email?.split("@")[0] ??
          "user";
        setUsername(name);
      }
    });
  }, []);

  return (
    <aside className="flex h-full w-48 flex-col border-r border-white/[0.06] bg-[#0d0d0d]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-4">
        <SpiderLogo />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-white/[0.06] text-violet-300"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-2.5">
        {username && (
          <div className="mb-1 px-3 py-1.5">
            <div className="text-xs text-white/30">Signed in as</div>
            <div className="truncate text-sm font-medium text-white/60">{username}</div>
          </div>
        )}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/30 transition hover:bg-white/[0.04] hover:text-white/50"
        >
          <LogOut className="h-4 w-4" />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
