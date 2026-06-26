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
  const [user, setUser] = useState<{ username?: string; id: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const identities = data.user.identities ?? [];
        const discordIdent = identities.find((i) => i.provider === "discord");
        const discordUsername =
          discordIdent?.identity_data?.username as string | undefined ??
          data.user.user_metadata?.full_name ??
          data.user.email?.split("@")[0] ??
          "user";
        setUser({ username: discordUsername, id: data.user.id.slice(0, 18) });
      }
    });
  }, []);

  return (
    <aside className="flex h-full w-56 flex-col border-r border-white/[0.06] bg-[#0a0911]">
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
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300"
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
        {user && (
          <div className="mb-1 rounded-xl px-3 py-2 text-xs text-white/30">
            <div className="truncate font-medium text-white/50">Signed in as</div>
            <div className="truncate text-white/70">{user.username}</div>
            <div className="truncate font-mono text-[10px] text-white/20">UID: {user.id}</div>
          </div>
        )}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-white/30 transition hover:bg-white/[0.04] hover:text-white/50"
        >
          <LogOut className="h-4 w-4" />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
