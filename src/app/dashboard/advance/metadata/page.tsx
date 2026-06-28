"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeConfig, type ProfileConfig } from "@/lib/profile/schema";
import { saveProfileAction } from "../../customize/actions";
const F = "Satoshi, sans-serif";
function SaveIndicator({ state }: { state:"idle"|"saving"|"saved"|"error" }) {
  if (state === "idle") return null;
  const map = { saving:{bg:"#1a1a2e",border:"#3a3a6e",color:"#8888cc",text:"Saving…"}, saved:{bg:"#1a3a1a",border:"#3a8a3a",color:"#7ec87e",text:"✓ Saved"}, error:{bg:"#3a1a1a",border:"#8a3a3a",color:"#e07070",text:"✕ Save failed"} };
  const s = map[state];
  return <div style={{ position:"fixed",bottom:22,right:22,backgroundColor:s.bg,border:`1.5px solid ${s.border}`,color:s.color,borderRadius:12,padding:"8px 16px",fontFamily:F,fontSize:13,fontWeight:500,zIndex:9999,pointerEvents:"none",boxShadow:"0 4px 20px #0008" }}>{s.text}</div>;
}
function FieldInput({ label, value, onChange, placeholder }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
      <span style={{ fontSize:14,fontWeight:500,color:"#c8c8c8",fontFamily:F }}>{label}</span>
      <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%",backgroundColor:"#1a1a1a",border:"2px solid #232323",borderRadius:12,padding:"10px 14px",color:"#e0e0e0",fontFamily:F,fontSize:14,outline:"none",boxSizing:"border-box" }}
        onFocus={e=>{e.target.style.borderColor="#333";}} onBlur={e=>{e.target.style.borderColor="#232323";}} />
    </div>
  );
}
export default function MetadataPage() {
  const [cfg, setCfg] = useState<ProfileConfig | null>(null);
  const [saveState, setSaveState] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const latestCfg = useRef<ProfileConfig|null>(null);
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      if (!supabase) { setCfg(normalizeConfig({})); return; }
      const { data:{ user } } = await supabase.auth.getUser();
      if (!user) { setCfg(normalizeConfig({})); return; }
      const { data } = await supabase.from("profiles").select("config").eq("id",user.id).maybeSingle();
      setCfg(normalizeConfig(data?.config ?? {}));
    })();
  }, []);
  const triggerSave = useCallback((newCfg: ProfileConfig) => {
    latestCfg.current = newCfg;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const result = await saveProfileAction(latestCfg.current!, {});
        setSaveState(result.error ? "error" : "saved");
        setTimeout(() => setSaveState("idle"), 2200);
      } catch { setSaveState("error"); setTimeout(() => setSaveState("idle"), 2200); }
    }, 800);
  }, []);
  const set = useCallback(<K extends keyof ProfileConfig>(section: K, patch: Partial<ProfileConfig[K]>) => {
    setCfg(prev => {
      if (!prev) return prev;
      const next = { ...prev, [section]: { ...(prev[section] as object), ...patch } };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);
  if (!cfg) return <div style={{ color:"#555",fontFamily:F,padding:40 }}>Loading…</div>;
  const seo = cfg.seo as ProfileConfig["seo"] & { keywords?:string; ogImage?:string };
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:28,fontFamily:F }}>
      <SaveIndicator state={saveState} />
      <div>
        <h1 style={{ fontSize:22,fontWeight:700,color:"#fafafa",margin:0 }}>Advance — Profile Metadata</h1>
        <p style={{ fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:4 }}>SEO title, description, and Open Graph settings</p>
      </div>
      <div style={{ borderRadius:18,border:"1px solid rgba(255,255,255,0.06)",background:"#111",padding:"24px 24px 28px",display:"flex",flexDirection:"column",gap:20 }}>
        <FieldInput label="SEO Title" value={cfg.seo.title} onChange={v=>set("seo",{title:v})} placeholder="My Profile — brazy" />
        <FieldInput label="SEO Description" value={cfg.seo.description} onChange={v=>set("seo",{description:v})} placeholder="A short description for search engines" />
        <FieldInput label="Keywords" value={seo.keywords??""} onChange={v=>set("seo",{keywords:v} as Partial<ProfileConfig["seo"]>)} placeholder="developer, designer, creator" />
        <FieldInput label="OG Image URL" value={seo.ogImage??""} onChange={v=>set("seo",{ogImage:v} as Partial<ProfileConfig["seo"]>)} placeholder="https://…" />
      </div>
    </div>
  );
}
