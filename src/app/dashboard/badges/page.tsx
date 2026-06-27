"use client";

import { useState } from "react";
import { Award, Plus, ShoppingCart, GripVertical, Trash2, Star } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  imageUrl: string;
  color: string;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([
    { id: "1", name: "Verified", imageUrl: "", color: "#a855f7" },
    { id: "2", name: "Early Adopter", imageUrl: "", color: "#22d3ee" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Badge>>({});

  const openNew = () => {
    setForm({ name: "", imageUrl: "", color: "#a855f7" });
    setShowForm(true);
  };

  const addBadge = () => {
    if (!form.name?.trim()) return;
    setBadges([...badges, { id: Date.now().toString(), name: form.name || "", imageUrl: form.imageUrl || "", color: form.color || "#a855f7" }]);
    setShowForm(false);
  };

  const removeBadge = (id: string) => setBadges(badges.filter((b) => b.id !== id));

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Badges</h1>
          <p className="mt-1 text-sm text-white/40">Create and manage custom badges to display on your profile.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/40">{badges.length} / 10 badges</span>
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500">
            <Plus className="h-4 w-4" /> Add badge
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-transparent px-4 py-2.5 text-sm font-medium text-white/50 transition-all duration-200 hover:border-white/20 hover:text-white">
            <ShoppingCart className="h-4 w-4" /> Buy credits
          </button>
        </div>
      </div>

      {badges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] py-24 text-center">
          <Award className="mx-auto mb-4 h-10 w-10 text-white/20" />
          <p className="text-sm text-white/30">No badges yet. Create your first one!</p>
          <button onClick={openNew} className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-transparent px-4 py-2 text-sm font-medium text-white/60 transition-all duration-200 hover:border-white/20 hover:text-white">
            <Plus className="h-4 w-4" /> Create Badge
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Your Badges</p>
          <div className="space-y-2">
            {badges.map((badge, index) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-all duration-200 hover:border-white/[0.10]"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <GripVertical className="h-4 w-4 shrink-0 text-white/20" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${badge.color}20` }}>
                  {badge.imageUrl ? (
                    <img src={badge.imageUrl} alt={badge.name} className="h-6 w-6 rounded" />
                  ) : (
                    <Star className="h-5 w-5" style={{ color: badge.color }} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{badge.name}</p>
                  <p className="text-xs text-white/30">#{index + 1} in badge order</p>
                </div>
                <span className="rounded-lg px-2.5 py-1 text-[10px] font-medium" style={{ backgroundColor: `${badge.color}15`, color: badge.color }}>
                  ● {badge.color}
                </span>
                <button onClick={() => removeBadge(badge.id)} className="rounded-lg p-2 text-white/20 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0f0d1a] p-6 shadow-2xl">
            <h2 className="mb-5 text-lg font-semibold text-white">New Badge</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Badge Name</label>
                <input
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Verified, Pro, Early Supporter"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.color || "#a855f7"} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-9 w-9 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span className="text-xs text-white/50">{form.color}</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Custom Image URL (optional)</label>
                <input
                  value={form.imageUrl || ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2.5 text-sm text-white/50 transition-all duration-200 hover:bg-white/5 hover:text-white">Cancel</button>
              <button onClick={addBadge} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
