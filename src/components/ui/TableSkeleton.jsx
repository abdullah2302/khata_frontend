export default function TableSkeleton({ rows = 5 }) {
  return (
    <div className="border-t-2 border-ink" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 border-b border-rule py-4">
          <div className="h-4 w-1/4 rounded bg-rule" />
          <div className="h-4 w-1/5 rounded bg-rule" />
          <div className="h-4 flex-1 rounded bg-rule/60" />
        </div>
      ))}
    </div>
  );
}
