"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setError("Username must be 3–20 chars: lowercase, numbers, underscores");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) { setError("Supabase not configured"); setLoading(false); return; }

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    const user = data.user;
    if (!user) { setError("Signup failed"); setLoading(false); return; }

    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ id: user.id, username: username.toLowerCase(), created_at: new Date().toISOString() });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Username already taken");
      } else {
        setError(insertError.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08070d] p-4" style={{ fontFamily: "Satoshi, sans-serif" }}>
      <div
        style={{
          background: "#141414",
          border: "2px solid #181818",
          borderRadius: 24,
          padding: 32,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <h1 className="text-2xl font-bold text-[#fafafa]" style={{ fontWeight: 700 }}>
            join brazy
          </h1>
          <p className="mt-1 text-sm text-[#a5a4a4]">create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#a5a4a4]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              required
              minLength={3}
              maxLength={20}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#a5a4a4]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#a5a4a4]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/50"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
            style={{
              backgroundColor: loading ? "rgba(126,44,139,0.3)" : "rgba(126,44,139,0.44)",
              border: "2px solid rgba(126,44,139,0.61)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#a5a4a4]">
          already have an account?{" "}
          <Link href="/auth/login" className="text-violet-400 transition hover:text-violet-300">
            sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
