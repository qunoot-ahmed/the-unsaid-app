"use client";

import { Button, SmallCaps } from "@/shared/ui";

// Error boundary: a reference for support, never internal details.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-[var(--content-max)] flex-col justify-center gap-6 px-4 py-24 md:px-8"
    >
      <SmallCaps className="text-text-secondary">Something went wrong</SmallCaps>
      <h1 className="m-0 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] font-light italic">
        The page could not be opened.
      </h1>
      <p className="m-0 font-reading text-reading-compact text-text-body">
        This is a problem on our side. Try again in a moment.
      </p>
      {error.digest ? (
        <p className="m-0 text-help text-text-secondary">Reference: {error.digest}</p>
      ) : null}
      <Button onClick={reset} className="self-start">
        Try again
      </Button>
    </main>
  );
}
