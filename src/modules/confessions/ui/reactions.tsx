"use client";

import { useState } from "react";

const REACTIONS = [
  { key: "felt", label: "I felt this" },
  { key: "same", label: "Me too" },
  { key: "holding", label: "Holding this" },
] as const;

type ReactionKey = (typeof REACTIONS)[number]["key"];

// Demonstration only: reactions are kept in the page and are not saved (Milestone 3 adds storage).
export function Reactions({ counts }: { counts: Readonly<Record<ReactionKey, number>> }) {
  const [pressed, setPressed] = useState<Record<ReactionKey, boolean>>({
    felt: false,
    same: false,
    holding: false,
  });
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Reactions">
      {REACTIONS.map((reaction) => {
        const isPressed = pressed[reaction.key];
        return (
          <button
            key={reaction.key}
            type="button"
            aria-pressed={isPressed}
            onClick={() =>
              setPressed((state) => ({ ...state, [reaction.key]: !state[reaction.key] }))
            }
            className={
              isPressed
                ? "inline-flex min-h-11 items-center gap-2 border border-accent bg-surface px-3.5 text-help text-accent"
                : "inline-flex min-h-11 items-center gap-2 border border-control-border px-3.5 text-help text-text-body hover:border-text-secondary hover:text-text"
            }
          >
            {reaction.label}
            <span className="tabular-nums">{counts[reaction.key] + (isPressed ? 1 : 0)}</span>
          </button>
        );
      })}
    </div>
  );
}
