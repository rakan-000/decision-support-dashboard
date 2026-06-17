export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-7 w-48 rounded bg-[var(--muted)]" />
      <div className="mb-4 h-10 w-full rounded-[var(--radius-md)] bg-[var(--muted)]" />
      <div className="mb-4 h-14 w-full rounded-[var(--radius-lg)] bg-[var(--muted)]" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-[var(--radius-lg)] bg-[var(--muted)]" />
        ))}
      </div>
    </div>
  );
}
