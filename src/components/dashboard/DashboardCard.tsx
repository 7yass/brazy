export function DashboardCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-[25px] border-2 border-[#181818] bg-[#141414] p-5">
      <h3 className="mb-[5.5px] ml-[3px] text-[16.5px] font-medium text-[#c5c5c5]">
        {title}
      </h3>
      <div className="flex flex-col gap-[14px]">
        {children}
      </div>
    </div>
  );
}