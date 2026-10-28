// Decorative fleuron used between a scene and its choices. Hidden from assistive technology.
export function Ornament() {
  return (
    <div aria-hidden="true" className="my-12 flex items-center justify-center gap-3.5 text-accent">
      <span className="h-px w-16 bg-control-border" />
      <svg width="40" height="12" viewBox="0 0 40 12" fill="currentColor">
        <path d="M6 6l4-4 4 4-4 4zM16 6l4-5 4 5-4 5zM26 6l4-4 4 4-4 4z" />
      </svg>
      <span className="h-px w-16 bg-control-border" />
    </div>
  );
}

export function SmallCaps({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-label font-bold tracking-[0.14em] uppercase tabular-nums ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
