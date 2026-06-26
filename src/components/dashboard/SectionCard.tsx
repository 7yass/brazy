export function SectionCard({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#141414",
        border: "2px solid #181818",
        borderRadius: 25,
        padding: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          margin: "0 0 5.5px 3px",
          fontSize: 16.5,
          fontWeight: 500,
          color: "#c5c5c5",
        }}
      >
        {title}
      </h3>
      <div className="flex flex-col" style={{ gap: 14 }}>
        {children}
      </div>
    </div>
  );
}
