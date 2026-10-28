// Endings this reader has found, by title, and unnamed placeholders for the rest.
export function EndingsFound({ total, found }: { total: number; found: ReadonlyArray<string> }) {
  const undiscovered = Math.max(0, total - found.length);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="m-0 text-label font-bold tracking-[0.14em] text-text-secondary uppercase">
        Endings found
      </h2>
      <p className="m-0 text-help text-text-body">
        {found.length} of {total}
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {found.map((title) => (
          <li key={title} className="flex items-center gap-2.5 text-help">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden="true"
              className="text-accent"
            >
              <path d="M6 0l6 6-6 6-6-6z" fill="currentColor" />
            </svg>
            <span className="font-display italic">{title}</span>
          </li>
        ))}
        {Array.from({ length: undiscovered }, (_, index) => (
          <li
            key={`undiscovered-${index}`}
            className="flex items-center gap-2.5 text-help text-text-secondary"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M6 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" />
            </svg>
            Undiscovered
          </li>
        ))}
      </ul>
    </div>
  );
}
