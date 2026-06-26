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
    <aside
      className="flex h-full flex-col justify-between overflow-y-auto"
      style={{
        minWidth: 300,
        maxWidth: 300,
        backgroundColor: "#0e0e0e",
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        padding: 25,
      }}
    >
      <div>
        <div className="flex items-center gap-2 pb-5" style={{ borderBottom: "1px solid #181818" }}>
          <SpiderLogo />
        </div>

        <nav className="mt-5 flex flex-col gap-[6.5px]" style={{ marginLeft: -10 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px 10px 15px",
                  borderRadius: 20,
                  fontSize: 17.4,
                  fontWeight: 500,
                  color: "#fafafa",
                  textDecoration: "none",
                  transition: "background-color 0.15s",
                  backgroundColor: isActive ? "rgba(218,102,218,0.155)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "rgba(250,250,250,0.15)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon className="shrink-0" style={{ width: 20, height: 20 }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ borderTop: "1px solid #181818", paddingTop: 12, marginTop: 12 }}>
        {user && (
          <div className="mb-2" style={{ padding: "10px 10px 10px 15px" }}>
            <div className="truncate text-xs" style={{ color: "#a5a4a4" }}>Signed in as</div>
            <div className="truncate text-sm font-medium" style={{ color: "#fafafa" }}>{user.username}</div>
          </div>
        )}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 10px 10px 15px",
            borderRadius: 20,
            fontSize: 17.4,
            fontWeight: 500,
            color: "#fafafa",
            textDecoration: "none",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(250,250,250,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <LogOut className="shrink-0" style={{ width: 20, height: 20 }} />
          <span>Back to site</span>
        </Link>
      </div>
    </aside>
  );
}
