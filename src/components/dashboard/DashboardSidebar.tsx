"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  Settings,
  Award,
  LayoutTemplate,
  Gem,
  ImageIcon,
  HelpCircle,
  ExternalLink,
  Share2,
  UserCircle2,
  MoreHorizontal,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { SpiderLogo } from "@/components/spider-logo";
import { createClient } from "@/lib/supabase/client";

// ── Sidebar nav structure ────────────────────────────────────────────────────
// 1. Account  (collapsible)
//    ├─ Overview
//    ├─ Analytics
//    ├─ Badges
//    └─ Settings
// 2. Customize  (standalone)
// 3. Links      (standalone)
// 4. Advance    (collapsible)
//    ├─ General
//    ├─ Layout Settings
//    └─ Profile Metadata
// 5. Image Host (standalone)
// ────────────────────────────────────────────────────────────────────────────

const accountSubItems = [
  { href: "/dashboard/account", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/badges", label: "Badges", icon: Award },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const advanceSubItems = [
  { href: "/dashboard/advance", label: "General", icon: Gem },
  { href: "/dashboard/advance/layout", label: "Layout Settings", icon: LayoutTemplate },
  { href: "/dashboard/advance/metadata", label: "Profile Metadata", icon: UserCircle2 },
];

const standaloneItems = [
  { href: "/dashboard/customize", label: "Customize", icon: Palette },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [accountOpen, setAccountOpen] = useState(true);
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const identities = user.identities ?? [];
      const discordIdent = identities.find((i) => i.provider === "discord");
      const name =
        (discordIdent?.identity_data?.username as string | undefined) ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "user";
      setUsername(name);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.username) setUsername(profile.username);
    })();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleShare = async () => {
    const url = `https://brazy.lol/${username ?? ""}`;
    if (navigator.share) {
      await navigator.share({ url }).catch(() => {});
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
  };

  // helper: is any sub-item in this group active?
  const isAccountActive = accountSubItems.some((s) => pathname === s.href);
  const isAdvanceActive = advanceSubItems.some((s) => pathname === s.href);

  return (
    <aside className="flex h-full w-48 flex-col border-r border-white/[0.06] bg-[#0d0d0d]">
      {/* ── Logo bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-4">
        <SpiderLogo />
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-4">

        {/* 1. Account (collapsible) */}
        <CollapsibleGroup
          label="Account"
          icon={<UserCircle2 className="h-4 w-4 shrink-0" />}
          open={accountOpen || isAccountActive}
          onToggle={() => setAccountOpen(!accountOpen)}
          isActive={isAccountActive}
        >
          {accountSubItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <SubLink key={item.href} href={item.href} label={item.label} isActive={isActive}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
              </SubLink>
            );
          })}
        </CollapsibleGroup>

        {/* 2. Customize (standalone) */}
        {standaloneItems.slice(0, 1).map((item) => (
          <StandaloneLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* 3. Links (standalone) */}
        {standaloneItems.slice(1).map((item) => (
          <StandaloneLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* 4. Advance (collapsible) */}
        <CollapsibleGroup
          label="Advance"
          icon={<Gem className="h-4 w-4 shrink-0" />}
          open={advanceOpen || isAdvanceActive}
          onToggle={() => setAdvanceOpen(!advanceOpen)}
          isActive={isAdvanceActive}
        >
          {advanceSubItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <SubLink key={item.href} href={item.href} label={item.label} isActive={isActive}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
              </SubLink>
            );
          })}
        </CollapsibleGroup>

        {/* 5. Image Host (standalone) */}
        <StandaloneLink
          item={{ href: "/dashboard/assets", label: "Image Host", icon: ImageIcon }}
          pathname={pathname}
        />
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col border-t border-white/[0.06]">
        <div className="flex flex-col gap-1.5 px-3 py-3">
          <a
            href="https://discord.gg/brazy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/30 transition-colors hover:text-white/60"
          >
            <HelpCircle style={{ width: 13, height: 13 }} />
            Help Center
          </a>
          <a
            href={`/${username ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/30 transition-colors hover:text-white/60"
          >
            <ExternalLink style={{ width: 13, height: 13 }} />
            {username ? `/${username}` : "My Page"}
          </a>
        </div>

        <div className="border-t border-white/[0.06] px-3 py-2.5">
          <button
            onClick={handleShare}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
          >
            <Share2 style={{ width: 13, height: 13 }} />
            {copied ? "Copied!" : "Share your profile"}
          </button>
        </div>

        <div className="border-t border-white/[0.06] px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <UserCircle2 style={{ width: 15, height: 15, color: "#fff" }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-medium text-white/70" style={{ maxWidth: 80 }}>
                  {username ?? "..."}
                </span>
                <span className="truncate text-[10px] text-white/25" style={{ maxWidth: 80 }}>
                  brazy.lol/{username ?? "..."}
                </span>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowPopover(!showPopover)}
                className="text-white/30 transition-colors hover:text-white/60"
              >
                <MoreHorizontal style={{ width: 15, height: 15 }} />
              </button>

              {showPopover && (
                <div
                  ref={popoverRef}
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    minWidth: 130,
                    zIndex: 50,
                    background: "#141414",
                    border: "1px solid #1f1f1f",
                    borderRadius: 12,
                    padding: 6,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowPopover(false)}
                    style={{
                      display: "block",
                      fontSize: 12,
                      padding: "7px 10px",
                      borderRadius: 8,
                      color: "#a5a4a4",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      fontSize: 12,
                      padding: "7px 10px",
                      borderRadius: 8,
                      color: "#f87171",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div className="flex items-center gap-2">
                      <LogOut style={{ width: 12, height: 12 }} />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function StandaloneLink({
  item,
  pathname,
}: {
  item: { href: string; label: string; icon: React.ElementType };
  pathname: string;
}) {
  const isActive = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
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
}

function CollapsibleGroup({
  label,
  icon,
  open,
  onToggle,
  isActive,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
          open || isActive
            ? "text-white/70"
            : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
        }`}
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-2 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function SubLink({
  href,
  label,
  isActive,
  children,
}: {
  href: string;
  label: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        isActive
          ? "bg-white/[0.06] text-violet-300"
          : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
      }`}
    >
      {children}
      {label}
    </Link>
  );
}
