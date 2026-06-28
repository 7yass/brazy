"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Link2, Palette, BarChart3, Settings, Award,
  LayoutTemplate, Gem, ImageIcon, HelpCircle, ExternalLink, Share2,
  UserCircle2, MoreHorizontal, LogOut, ChevronDown, Layers, Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const accountSubItems = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/account/badges", label: "Badges", icon: Award },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

const advanceSubItems = [
  { href: "/advance", label: "General", icon: Gem },
  { href: "/advance/layout", label: "Layout Settings", icon: LayoutTemplate },
  { href: "/advance/metadata", label: "Profile Metadata", icon: UserCircle2 },
];

const standaloneItems = [
  { href: "/customize", label: "Customize", icon: Palette },
  { href: "/links", label: "Links", icon: Link2 },
  { href: "/sections", label: "Sections", icon: Layers },
  { href: "/widgets", label: "Widgets", icon: Sparkles },
  { href: "/assets", label: "Assets", icon: ImageIcon },
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
        .from("profiles").select("username").eq("id", user.id).maybeSingle();
      if (profile?.username) setUsername(profile.username);
    })();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node))
        setShowPopover(false);
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

  const isAccountActive = accountSubItems.some((s) => pathname === s.href);
  const isAdvanceActive = advanceSubItems.some((s) => pathname === s.href);

  return (
    <aside className="flex h-full w-56 flex-col border-r border-neutral-900 bg-neutral-950/80 backdrop-blur-md select-none font-sans">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 border-b border-neutral-900 px-6 py-5">
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-xl font-black text-white tracking-tight">brazy</span>
          <span className="text-xl font-black text-red-500 animate-pulse">.</span>
          <span className="text-xs font-semibold text-neutral-500 mt-1.5 transition-colors group-hover:text-red-400">dashboard</span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3.5 py-5 scrollbar-none">
        
        {/* Collapsible Account Group */}
        <CollapsibleGroup 
          label="Account" 
          icon={<UserCircle2 className="h-4 w-4 shrink-0" />}
          open={accountOpen || isAccountActive} 
          onToggle={() => setAccountOpen(!accountOpen)} 
          isActive={isAccountActive}
        >
          {accountSubItems.map((item) => {
            const Icon = item.icon;
            return (
              <SubLink key={item.href} href={item.href} label={item.label} isActive={pathname === item.href}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
              </SubLink>
            );
          })}
        </CollapsibleGroup>

        <div className="py-2.5">
          <div className="h-px bg-neutral-900/60 my-1 mx-1.5" />
        </div>

        {/* Standalone Items */}
        {standaloneItems.map((item) => (
          <StandaloneLink key={item.href} item={item} pathname={pathname} />
        ))}

        <div className="py-2.5">
          <div className="h-px bg-neutral-900/60 my-1 mx-1.5" />
        </div>

        {/* Collapsible Advance Group */}
        <CollapsibleGroup 
          label="Advance" 
          icon={<Gem className="h-4 w-4 shrink-0" />}
          open={advanceOpen || isAdvanceActive} 
          onToggle={() => setAdvanceOpen(!advanceOpen)} 
          isActive={isAdvanceActive}
        >
          {advanceSubItems.map((item) => {
            const Icon = item.icon;
            return (
              <SubLink key={item.href} href={item.href} label={item.label} isActive={pathname === item.href}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
              </SubLink>
            );
          })}
        </CollapsibleGroup>

      </nav>

      {/* Footer Info / User Card */}
      <div className="flex flex-col border-t border-neutral-900 bg-neutral-950/40">
        
        {/* Help / View Page Links */}
        <div className="flex flex-col gap-2 px-4.5 py-3.5 border-b border-neutral-900/50">
          <a 
            href="https://discord.gg/brazy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Help Center
          </a>
          <a 
            href={`/${username ?? ""}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{username ? `brazy.it/${username}` : "My Profile Page"}</span>
          </a>
        </div>

        {/* Share Button */}
        <div className="px-4.5 py-2.5 border-b border-neutral-900/40">
          <button 
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900/40 hover:bg-red-600/10 border border-neutral-900 hover:border-red-500/20 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-red-500 transition-all duration-150 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Copied Link!" : "Share Profile"}</span>
          </button>
        </div>

        {/* User Badge Info */}
        <div className="px-4.5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center flex-shrink-0 font-bold text-white text-xs shadow-md shadow-red-600/10">
                {username ? username.substring(0, 2).toUpperCase() : "?"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-bold text-white leading-tight">{username ?? "..."}</span>
                <span className="truncate text-[10px] text-neutral-500 font-medium">Free Member</span>
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowPopover(!showPopover)} 
                className="text-neutral-500 hover:text-neutral-300 p-1 hover:bg-neutral-900 rounded-md transition cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showPopover && (
                <div 
                  ref={popoverRef} 
                  className="absolute bottom-full right-0 mb-2 min-w-[130px] z-50 bg-neutral-950 border border-neutral-850 rounded-xl p-1.5 flex flex-col gap-1 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-100"
                >
                  <Link 
                    href="/account/settings" 
                    onClick={() => setShowPopover(false)}
                    className="block text-xs font-semibold px-3 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left text-xs font-semibold px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" /> Sign out
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

function StandaloneLink({ item, pathname }: { item: { href: string; label: string; icon: React.ElementType }; pathname: string }) {
  const isActive = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link 
      href={item.href} 
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
        isActive 
          ? "bg-red-600/10 border-l-2 border-red-500 text-red-500 px-3.5" 
          : "text-neutral-400 hover:bg-neutral-900/40 hover:text-neutral-200 border-l-2 border-transparent"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

function CollapsibleGroup({ label, icon, open, onToggle, isActive, children }: { label: string; icon: React.ReactNode; open: boolean; onToggle: () => void; isActive: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <button 
        onClick={onToggle} 
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 border-l-2 border-transparent cursor-pointer ${
          open || isActive 
            ? "text-neutral-200" 
            : "text-neutral-400 hover:bg-neutral-900/40 hover:text-neutral-200"
        }`}
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 text-neutral-500 ${open ? "rotate-0" : "-rotate-90"}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-250 ${open ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
        <div className="ml-5 space-y-1 border-l border-neutral-900 pl-3">{children}</div>
      </div>
    </div>
  );
}

function SubLink({ href, label, isActive, children }: { href: string; label: string; isActive: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold transition-all duration-150 ${
        isActive 
          ? "text-red-500" 
          : "text-neutral-500 hover:text-neutral-300"
      }`}
    >
      {children}
      <span>{label}</span>
    </Link>
  );
}

