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
  Layers,
  Puzzle,
  Briefcase,
} from "lucide-react";
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
  const [user, setUser] = useState<{ username: string; avatarUrl: string } | null>(null);

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
        const avatarUrl =
          (discordIdent?.identity_data?.avatar_url as string | undefined) ??
          (discordIdent?.identity_data?.avatar as string | undefined) ??
          data.user.user_metadata?.avatar_url as string | undefined ??
          `https://cdn.discordapp.com/embed/avatars/${Number(data.user.id.slice(0, 1)) % 5}.png`;
        setUser({ username: discordUsername, avatarUrl });
      }
    });
  }, []);

  return (
    <aside
      className="flex flex-col justify-between overflow-y-auto no-scrollbar"
      style={{
        position: "fixed",
        left: 0,
        minWidth: 300,
        maxWidth: 300,
        height: "100%",
        backgroundColor: "#0e0e0e",
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        padding: 25,
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <div>
        <div
          className="flex items-center gap-3"
          style={{ paddingBottom: 20, borderBottom: "1px solid #181818" }}
        >
          <img
            src={user?.avatarUrl}
            alt=""
            style={{
              width: 57,
              height: 57,
              borderRadius: "50%",
              border: "2px solid #222222",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div className="flex flex-col" style={{ gap: 0 }}>
            <span style={{ fontSize: 18.5, fontWeight: 550, color: "#fafafa" }}>
              {user?.username ?? "Loading..."}
            </span>
            <a
              href={`https://brazy.it/${user?.username ?? ""}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 14.5,
                color: "#a5a4a4",
                textDecoration: "none",
              }}
            >
              brazy.it/{user?.username ?? ""}
            </a>
          </div>
        </div>

        <nav
          className="flex flex-col"
          style={{ gap: 6.5, marginTop: 20, marginLeft: -10 }}
        >
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
                  gap: 7,
                  padding: "10px 10px 10px 15px",
                  borderRadius: 20,
                  fontSize: 17.4,
                  fontWeight: 500,
                  color: "#fafafa",
                  textDecoration: "none",
                  transition: "0.4s",
                  backgroundColor: isActive ? "rgba(218,102,218,0.155)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#fafafa27";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon className="shrink-0" style={{ width: 23, height: 23 }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {user && (
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: 35,
            padding: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center" style={{ gap: 8 }}>
            <img
              src={user.avatarUrl}
              alt=""
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "2px solid #222222",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 15, fontWeight: 500, color: "#fafafa" }}>
              {user.username}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
