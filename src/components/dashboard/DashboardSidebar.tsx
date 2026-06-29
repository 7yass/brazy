"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Link2, Palette, BarChart3, Settings, Award,
  LayoutTemplate, Gem, Share2, UserCircle2, MoreHorizontal, LogOut,
  ChevronDown, ChevronRight, Layers, Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SpiderLogo } from "@/components/spider-logo";

const advanceSubItems = [
  { href: "/advance", label: "General", icon: Gem },
  { href: "/advance/layout", label: "Layout Settings", icon: LayoutTemplate },
  { href: "/advance/metadata", label: "Profile Metadata", icon: UserCircle2 },
];

const accountSubItems = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/account/badges", label: "Badges", icon: Award },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
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
        .from("profiles").select("username").eq("id", user.id).maybeSingle();
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
    const url = `https://brazy.it/${username ?? ""}`;
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

  const isAdvanceActive = advanceSubItems.some((s) => pathname === s.href);
  const isAccountActive = accountSubItems.some((s) => pathname === s.href);

  // Set initial collapsible state based on pathname
  useEffect(() => {
    if (isAdvanceActive) setAdvanceOpen(true);
    if (isAccountActive) setAccountOpen(true);
  }, [isAdvanceActive, isAccountActive]);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/5 bg-neutral-950 font-sans select-none p-4 justify-between gap-4">
      
      {/* Upper Container */}
      <div className="flex flex-col gap-4">
        {/* Header Logo */}
        <Link href="/" className="flex w-full cursor-pointer items-center justify-center py-2 group">
          <SpiderLogo className="h-8 w-8 text-red-500 mr-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-transform duration-300 group-hover:scale-105" />
          <span className="text-2xl font-black text-white tracking-tight">brazy</span>
          <span className="text-red-500 font-black text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">.</span>
          <span className="text-white font-black text-2xl tracking-tight">it</span>
        </Link>

        {/* Profile Switcher Card */}
        <button
          type="button"
          className="flex h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/5 bg-neutral-900/30 hover:bg-neutral-900/60 px-3 shadow-sm transition duration-150 active:translate-y-px outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-800/80 flex items-center justify-center text-xs font-bold text-neutral-300 border border-white/10 shrink-0">
            {username ? username.substring(0, 1).toUpperCase() : "?"}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest leading-none mb-0.5">Profile</div>
            <div className="text-xs font-bold text-white truncate leading-none">{username ?? "Default"}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
        </button>

        {/* Nav Link List */}
        <nav className="flex flex-col gap-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-320px)]">
          <StandaloneLink href="/dashboard" label="Overview" icon={LayoutDashboard} isActive={pathname === "/dashboard"} />
          <StandaloneLink href="/customize" label="Customize" icon={Palette} isActive={pathname === "/customize"} />
          <StandaloneLink href="/links" label="Links" icon={Link2} isActive={pathname === "/links"} />
          <StandaloneLink href="/sections" label="Sections" icon={Layers} isActive={pathname === "/sections"} />
          <StandaloneLink href="/widgets" label="Widgets" icon={Sparkles} isActive={pathname === "/widgets"} />

          {/* Collapsible Advanced Section */}
          <CollapsibleGroup
            label="Advanced"
            icon={<Gem className="w-4 h-4" />}
            open={advanceOpen}
            onToggle={() => setAdvanceOpen(!advanceOpen)}
            isActive={isAdvanceActive}
          >
            {advanceSubItems.map((item) => (
              <SubLink key={item.href} href={item.href} label={item.label} icon={item.icon} isActive={pathname === item.href} />
            ))}
          </CollapsibleGroup>

          {/* Collapsible Account Section */}
          <CollapsibleGroup
            label="Account"
            icon={<UserCircle2 className="w-4 h-4" />}
            open={accountOpen}
            onToggle={() => setAccountOpen(!accountOpen)}
            isActive={isAccountActive}
          >
            {accountSubItems.map((item) => (
              <SubLink key={item.href} href={item.href} label={item.label} icon={item.icon} isActive={pathname === item.href} />
            ))}
          </CollapsibleGroup>
        </nav>
      </div>

      {/* Footer Container */}
      <div className="flex flex-col gap-2">
        {/* Share Button Card */}
        <button
          onClick={handleShare}
          className="flex h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/5 bg-neutral-900/30 hover:bg-neutral-900/60 px-3 shadow-sm transition duration-150 active:translate-y-px outline-none"
        >
          <div className="grid size-8 place-items-center rounded-xl bg-neutral-800/80 text-neutral-300 border border-white/10 shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest leading-none mb-0.5">Profile</div>
            <div className="text-xs font-bold text-white truncate leading-none">{copied ? "Copied URL!" : "Share your profile"}</div>
          </div>
        </button>
        {/* View Your Page Link */}
        <Link
          href={username ? `/${username}` : '/'}
          className="flex h-14 w-full items-center gap-3 rounded-2xl border border-white/5 bg-neutral-900/30 hover:bg-neutral-900/60 px-3 shadow-sm transition duration-150 active:translate-y-px outline-none"
        >
          <div className="grid size-8 place-items-center rounded-xl bg-neutral-800/80 text-neutral-300 border border-white/10 shrink-0">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest leading-none mb-0.5">Profile</div>
            <div className="text-xs font-bold text-white truncate leading-none">View your page</div>
          </div>
        </Link>

        {/* User Account Card */}
        <div className="relative w-full">
          <button
            onClick={() => setShowPopover(!showPopover)}
            className={`flex h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/5 px-3 shadow-sm transition duration-150 active:translate-y-px outline-none ${
              showPopover ? "bg-neutral-900/80" : "bg-neutral-900/30 hover:bg-neutral-900/60"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-800/80 flex items-center justify-center text-xs font-bold text-neutral-300 border border-white/10 shrink-0">
              {username ? username.substring(0, 1).toUpperCase() : "?"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest leading-none mb-0.5">Signed in as</div>
              <div className="text-xs font-bold text-white truncate leading-none">{username ?? "..."}</div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-neutral-500 shrink-0" />
          </button>

          {showPopover && (
            <div
              ref={popoverRef}
              className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-neutral-950 border border-white/5 rounded-2xl p-1.5 flex flex-col gap-1 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-100"
            >
              <Link
                href="/account/settings"
                onClick={() => setShowPopover(false)}
                className="block text-xs font-bold px-3.5 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left text-xs font-bold px-3.5 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer border-none bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function StandaloneLink({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition duration-150 ${
        isActive
          ? "border-red-950/40 bg-red-950/10 text-red-500"
          : "border-transparent text-neutral-400 hover:bg-neutral-900/40 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function CollapsibleGroup({
  label, icon, open, onToggle, isActive, children,
}: {
  label: string; icon: React.ReactNode; open: boolean; onToggle: () => void; isActive: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition duration-150 cursor-pointer text-left border-none bg-transparent ${
          open || isActive
            ? "text-white"
            : "text-neutral-400 hover:bg-neutral-900/40 hover:text-white"
        }`}
      >
        {icon}
        <span className="flex-1">{label}</span>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
        )}
      </button>
      {open && (
        <div className="pl-6 flex flex-col gap-1 mt-1 border-l border-white/[0.03] ml-[22px] py-0.5 animate-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

function SubLink({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition duration-150 border ${
        isActive
          ? "border-red-950/20 bg-red-950/5 text-red-500 font-bold"
          : "border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/20"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
