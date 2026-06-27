"use client";

import { useState } from "react";
import { LayoutTemplate, Heart, Clock, Upload, Search, Sparkles, Eye } from "lucide-react";

interface Template {
  id: number;
  name: string;
  author: string;
  tags: string[];
  favorites: number;
  uses: number;
  gradient: string;
}

const templates: Template[] = [
  { id: 1, name: "Midnight Nebula", author: "brazy", tags: ["dark", "violet", "glass"], favorites: 234, uses: 1204, gradient: "from-violet-900 via-fuchsia-800 to-indigo-900" },
  { id: 2, name: "Cyber Wave", author: "brazy", tags: ["dark", "cyan", "neon"], favorites: 189, uses: 892, gradient: "from-cyan-900 via-blue-800 to-violet-900" },
  { id: 3, name: "Rose Garden", author: "community", tags: ["light", "pink", "minimal"], favorites: 145, uses: 667, gradient: "from-pink-200 via-rose-100 to-white" },
  { id: 4, name: "Toxic Waste", author: "community", tags: ["dark", "green", "glow"], favorites: 112, uses: 543, gradient: "from-lime-900 via-green-800 to-emerald-900" },
  { id: 5, name: "Golden Hour", author: "brazy", tags: ["light", "amber", "warm"], favorites: 98, uses: 412, gradient: "from-amber-200 via-orange-100 to-yellow-50" },
  { id: 6, name: "Deep Space", author: "brazy", tags: ["dark", "blue", "stars"], favorites: 87, uses: 398, gradient: "from-slate-900 via-blue-900 to-indigo-950" },
  { id: 7, name: "Cotton Candy", author: "community", tags: ["light", "pastel", "cute"], favorites: 76, uses: 345, gradient: "from-pink-200 via-purple-100 to-blue-100" },
  { id: 8, name: "Matrix", author: "community", tags: ["dark", "green", "code"], favorites: 65, uses: 287, gradient: "from-green-950 via-emerald-900 to-lime-900" },
  { id: 9, name: "Sunset", author: "brazy", tags: ["dark", "orange", "gradient"], favorites: 54, uses: 198, gradient: "from-orange-900 via-red-800 to-rose-900" },
];

const allTags = Array.from(new Set(templates.flatMap((t) => t.tags))).sort();

export default function TemplatesPage() {
  const [tab, setTab] = useState("library");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const filtered = templates.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedTags.length > 0 && !selectedTags.some((tag) => t.tags.includes(tag))) return false;
    return true;
  });

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="mt-1 text-sm text-white/40">Browse community-created templates, or design your own to share.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          {[
            { id: "library", label: "Template Library", icon: LayoutTemplate },
            { id: "favorites", label: "Favorites", icon: Heart },
            { id: "recent", label: "Recently Used", icon: Clock },
            { id: "uploads", label: "My Uploads", icon: Upload },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                  tab === t.id ? "bg-violet-600 text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-dashed border-white/[0.12] bg-transparent px-4 py-2 text-sm text-white/50 transition-all duration-200 hover:border-violet-500/50 hover:text-violet-400">
          <Upload className="h-4 w-4" /> Create Template
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] py-20 text-center">
          <LayoutTemplate className="mx-auto mb-3 h-8 w-8 text-white/20" />
          <p className="text-sm text-white/30">No templates match your filters.</p>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Available Templates</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <div
                key={template.id}
                className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.10]"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <div className={`relative aspect-video bg-gradient-to-br ${template.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-white/90">
                      <Eye className="h-4 w-4" /> Preview
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">{template.name}</h3>
                      <p className="mt-0.5 text-xs text-white/40">by {template.author}</p>
                    </div>
                    <Sparkles className="h-4 w-4 text-violet-400/50" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/40">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-white/30">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {template.favorites}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {template.uses} uses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
