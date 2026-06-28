"use client";

import { useState } from "react";
import { Globe, Zap, AlertTriangle, Check, Code2 } from "lucide-react";

const F = "Satoshi, system-ui, sans-serif";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, color, title, description }: { icon: React.ElementType; color: string; title: string; description: string }) {
  return (
    <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 16, height: 16, color }} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fafafa" }}>{title}</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

export default function AdvancePage() {
  const [customDomain, setCustomDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: F }}>

      <header>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Advanced</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Power user settings for your profile.</p>
      </header>

      <Card>
        <CardHeader icon={Globe} color="#60a5fa" title="Custom Domain" description="Point your own domain to your brazy page. Add a CNAME record pointing to cname.brazy.it." />
        <div style={{ padding: "16px 24px 22px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={customDomain}
              onChange={e => setCustomDomain(e.target.value)}
              placeholder="yourdomain.com"
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#fafafa", fontFamily: F, outline: "none" }}
            />
            <button
              onClick={handleSave}
              disabled={saving || !customDomain}
              style={{ padding: "9px 18px", borderRadius: 10, background: customDomain ? "linear-gradient(135deg,#dc2626,#e11d48)" : "rgba(255,255,255,0.05)", border: "none", color: customDomain ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 600, cursor: customDomain ? "pointer" : "default", fontFamily: F, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
            >
              {saved ? <><Check style={{ width: 13, height: 13 }} /> Saved</> : saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader icon={Zap} color="#fbbf24" title="SEO & Metadata" description="Custom meta title, description and OG image — gives your page better previews when shared." />
        <div style={{ padding: "16px 24px 22px" }}>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Coming soon — check back shortly.</p>
        </div>
      </Card>

      <Card>
        <CardHeader icon={Code2} color="#a78bfa" title="Custom CSS" description="Inject your own CSS to fully override the default styles on your profile page." />
        <div style={{ padding: "16px 24px 22px" }}>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Coming soon — check back shortly.</p>
        </div>
      </Card>

      <div style={{ borderRadius: 20, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: "#ef4444" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Danger Zone</p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
        </div>
        <div style={{ padding: "16px 24px 22px" }}>
          <button style={{ padding: "9px 18px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}>Delete account</button>
        </div>
      </div>

    </div>
  );
}
