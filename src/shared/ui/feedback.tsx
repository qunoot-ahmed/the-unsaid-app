import type { ReactNode } from "react";
import { cn } from "./cn";

// Quiet, polite announcement, for autosave and progress messages.
export function StatusLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p role="status" className={cn("min-h-5 text-help text-text-secondary", className)}>
      {children}
    </p>
  );
}

// Failure message, announced immediately.
export function ErrorNotice({
  title,
  children,
  actions,
}: {
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div role="alert" className="flex flex-col gap-3 border border-danger bg-surface px-5 py-4">
      <p className="m-0 text-ui font-bold text-danger">{title}</p>
      {children ? <div className="text-help text-text-body">{children}</div> : null}
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <h2 className="m-0 font-display text-display-4 font-normal italic">{title}</h2>
      {children ? (
        <p className="m-0 font-reading text-reading-compact text-text-secondary">{children}</p>
      ) : null}
      {action}
    </div>
  );
}

// Placeholder shaped like the content it replaces, so nothing shifts when it arrives.
export function Skeleton({ lines = 3, label }: { lines?: number; label: string }) {
  const widths = ["w-11/12", "w-3/4", "w-7/12", "w-2/3"];
  return (
    <div aria-busy="true" className="flex flex-col gap-3 py-6">
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="block h-3 w-1/4 bg-surface" />
      {Array.from({ length: lines }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn("block h-5 bg-surface", widths.at(index % widths.length))}
        />
      ))}
    </div>
  );
}
