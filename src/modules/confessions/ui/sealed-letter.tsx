"use client";

import { useId, useState, useTransition } from "react";
import type { ContentNote } from "../domain/letters";
import { revealSealedLetter } from "../server/demo-actions";

type SealState =
  | { status: "sealed" }
  | { status: "opening" }
  | { status: "open"; body: string }
  | { status: "error"; message: string };

// A sealed letter's text is not in the page. It is requested from the server only when the
// reader chooses to break the seal, and it is forgotten again when they fold it away or reload.
export function SealedLetter({ id, contentNote }: { id: string; contentNote: ContentNote }) {
  const [state, setState] = useState<SealState>({ status: "sealed" });
  const [, startTransition] = useTransition();
  const regionId = useId();

  function breakSeal() {
    setState({ status: "opening" });
    startTransition(async () => {
      const result = await revealSealedLetter(id);
      setState(
        result.ok
          ? { status: "open", body: result.body }
          : { status: "error", message: result.message },
      );
    });
  }

  const isOpen = state.status === "open";

  return (
    <div className="flex flex-col gap-4">
      {isOpen ? null : (
        <div className="flex flex-col gap-4 border border-rule bg-surface p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            aria-hidden="true"
            className="shrink-0 text-accent"
          >
            <circle cx="22" cy="22" r="19" fill="currentColor" opacity="0.9" />
            <circle
              cx="22"
              cy="22"
              r="13"
              fill="none"
              stroke="var(--color-ground)"
              strokeWidth="1.2"
              opacity="0.55"
            />
            <path d="M15 22h14" stroke="var(--color-ground)" strokeWidth="1.4" opacity="0.55" />
          </svg>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="m-0 text-ui font-bold">Sealed by the writer · {contentNote}</p>
            <p className="m-0 text-help text-text-secondary">
              They asked that this be opened only by people who choose to.
            </p>
          </div>
          <button
            type="button"
            aria-expanded={false}
            aria-controls={regionId}
            onClick={breakSeal}
            disabled={state.status === "opening"}
            className="inline-flex min-h-11 items-center justify-center border border-accent px-4.5 text-ui font-bold text-text hover:bg-rule disabled:cursor-wait"
          >
            {state.status === "opening" ? "Opening" : "Break the seal"}
          </button>
        </div>
      )}

      <p role="status" className="sr-only">
        {state.status === "opening" ? "Opening the letter" : isOpen ? "Letter opened" : ""}
      </p>

      {state.status === "error" ? (
        <p role="alert" className="m-0 text-help text-danger">
          {state.message}
        </p>
      ) : null}

      <div id={regionId}>
        {isOpen ? (
          <p className="m-0 max-w-[60ch] origin-top animate-unfold font-reading text-reading-compact leading-[1.7] text-text-body md:text-reading">
            {state.body}
          </p>
        ) : null}
      </div>

      {isOpen ? (
        <button
          type="button"
          aria-expanded={true}
          aria-controls={regionId}
          onClick={() => setState({ status: "sealed" })}
          className="inline-flex min-h-11 items-center self-start text-help text-text-secondary underline underline-offset-4"
        >
          Fold it away again
        </button>
      ) : null}
    </div>
  );
}
