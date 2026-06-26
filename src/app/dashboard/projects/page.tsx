"use client";

import { useState } from "react";
import {
  Plus,
  Briefcase,
  ExternalLink,
  Code2,
  Trash2,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  githubUrl: string;
  tags: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "brazy.it",
      description: "The most customizable bio platform. One link, infinite vibes.",
      imageUrl: "",
      url: "https://brazy.it",
      githubUrl: "https://github.com",
      tags: ["next.js", "typescript", "supabase"],
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", imageUrl: "", url: "", githubUrl: "", tags: [] });
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({ ...project });
    setShowForm(true);
  };

  const save = () => {
    if (!form.title?.trim()) return;
    if (editing) {
      setProjects(projects.map(p => p.id === editing.id ? { ...p, ...form } as Project : p));
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: form.title || "",
        description: form.description || "",
        imageUrl: form.imageUrl || "",
        url: form.url || "",
        githubUrl: form.githubUrl || "",
        tags: form.tags || [],
      };
      setProjects([newProject, ...projects]);
    }
    setShowForm(false);
  };

  const remove = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !form.tags?.includes(tag.trim())) {
      setForm({ ...form, tags: [...(form.tags || []), tag.trim()] });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-white/40">
            Showcase your work with project cards on your profile.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          <Plus className="h-4 w-4" />
          Add project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] py-24 text-center">
          <Briefcase className="mx-auto mb-4 h-10 w-10 text-white/20" />
          <p className="text-sm text-white/30">No projects yet. Showcase your work!</p>
          <button
            onClick={openNew}
            className="mx-auto mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/20 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition hover:border-white/[0.12]"
            >
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-white/20" />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-white">{project.title}</h3>
                <p className="mt-1.5 text-xs text-white/40 line-clamp-2">{project.description}</p>
                {project.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/50 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <ExternalLink className="h-3 w-3" /> Visit
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/50 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Code2 className="h-3 w-3" /> Code
                    </a>
                  )}
                  <div className="ml-auto flex gap-1">
                    <button
                      onClick={() => openEdit(project)}
                      className="rounded-lg p-1.5 text-white/20 transition hover:bg-white/5 hover:text-white/50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(project.id)}
                      className="rounded-lg p-1.5 text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#0f0d1a] p-6 shadow-2xl">
            <h2 className="mb-5 text-lg font-semibold text-white">
              {editing ? "Edit Project" : "New Project"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Title</label>
                <input
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Project name"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Description</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Image URL</label>
                <input
                  value={form.imageUrl || ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs text-white/40">Project URL</label>
                  <input
                    value={form.url || ""}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/40">GitHub URL</label>
                  <input
                    value={form.githubUrl || ""}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(form.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 rounded-lg bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400"
                    >
                      {tag}
                      <button
                        onClick={() => setForm({ ...form, tags: form.tags?.filter((_, j) => j !== i) })}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder="Type a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                {editing ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
