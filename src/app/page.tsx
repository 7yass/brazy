import Link from "next/link";
import LoginButton from "@/components/landing/LoginButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const features = [
  {
    icon: "🎨",
    title: "Infinite customization",
    desc: "13 animated backgrounds, cursor effects, click bursts, themes, fonts — every pixel yours.",
  },
  {
    icon: "🎵",
    title: "Your soundtrack",
    desc: "Built-in music player with a live visualizer. Set the vibe the moment they land.",
  },
  {
    icon: "⚡",
    title: "Click-to-enter splash",
    desc: "Blur, glitch, or gradient intros. Make a first impression that hits.",
  },
  {
    icon: "🔗",
    title: "All your links",
    desc: "15 platforms supported with brand-colored icons. One link to rule them all.",
  },
  {
    icon: "📊",
    title: "View tracking",
    desc: "See who's visiting with a built-in view counter on every profile.",
  },
  {
    icon: "💻",
    title: "Custom CSS & HTML",
    desc: "Power users can drop in their own code for unlimited control.",
  },
];

export default async function Landing() {
  const configured = isSupabaseConfigured();
  const supabase = await createClient();
  let loggedIn = false;
  let username: string | undefined;

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      loggedIn = true;
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .maybeSingle();
      username = data?.username ?? undefined;
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08070d] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 40% at 15% 0%, rgba(168,85,247,0.18), transparent 60%), radial-gradient(50% 50% at 85% 10%, rgba(34,211,238,0.12), transparent 60%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
            style={{ background: "linear-gradient(135deg,#a855f7,#22d3ee)" }}
          >
            b
          </span>
          brazy
        </Link>
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <a href="/dashboard" className="text-sm text-white/70 transition hover:text-white">
              Dashboard
            </a>
          ) : (
            <a
              href={configured ? "/dashboard" : undefined}
              className="hidden text-sm text-white/70 transition hover:text-white sm:block"
            >
              Preview
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 text-center sm:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          now in early access
        </div>
        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          one link.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(120deg,#c084fc,#22d3ee)" }}
          >
            infinite vibes.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          The most customizable bio on the internet. Your music, your aesthetic, your links —
          all on one page that&apos;s unmistakably <span className="text-white/80">you</span>.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LoginButton configured={configured} loggedIn={loggedIn} username={username} />
          {!configured && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5"
            >
              Try the editor →
            </Link>
          )}
        </div>
        {!configured && (
          <p className="mt-4 text-xs text-white/40">
            Demo mode active — connect Supabase to enable Discord login &amp; saving.
          </p>
        )}

        {/* Example profile preview card */}
        <div className="mx-auto mt-20 max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold"
                style={{ background: "linear-gradient(135deg,#a855f7,#22d3ee)", padding: 3 }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#08070d]">
                  👑
                </div>
              </div>
              <p className="mt-4 text-xl font-bold">brazy</p>
              <p className="mt-1 text-sm text-white/50">founder · designer</p>
              <div className="mt-5 flex gap-3">
                {["#5865F2", "#E4405F", "#1DB954", "#ffffff"].map((c) => (
                  <span
                    key={c}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"
                    style={{ color: c }}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: c }} />
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs text-white/40">👁 3.8k views</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          More customizable than anything else
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-white/50">
          guns.lol, haunt.gg, e-z.bio — they give you presets. brazy gives you control.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-28 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Claim your brazy.</h2>
        <p className="mx-auto mt-4 max-w-md text-white/50">
          Grab your username before someone else does.
        </p>
        <div className="mt-8 flex justify-center">
          <LoginButton configured={configured} loggedIn={loggedIn} username={username} />
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        brazy.it — built different. © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
