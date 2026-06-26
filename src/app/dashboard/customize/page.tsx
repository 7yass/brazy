"use client";

export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white/90">Customize</h1>
        <p className="mt-0.5 text-sm text-white/40">Personalize your profile</p>
      </div>

      <div className="flex flex-col gap-5">
        <SectionCard title="Assets Uploader" />
        <SectionCard title="General Customization" />
        <SectionCard title="Color Customization" />
        <SectionCard title="Other Customization" />
      </div>
    </div>
  );
}

function SectionCard({ title }: { title: string }) {
  return (
    <div className="rounded-[15px] border border-white/[0.06] bg-[#111] px-6 py-5">
      <h3 className="text-base font-semibold text-white/90">{title}</h3>
    </div>
  );
}
