export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-24 rounded bg-[var(--muted)]" />
      <div className="h-12 w-2/3 rounded bg-[var(--muted)]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-[var(--radius-lg)] bg-[var(--muted)]" />
        ))}
      </div>
      <div className="h-10 w-full rounded bg-[var(--muted)]" />
      <div className="h-64 w-full rounded-[var(--radius-lg)] bg-[var(--muted)]" />
    </div>
  );
}
