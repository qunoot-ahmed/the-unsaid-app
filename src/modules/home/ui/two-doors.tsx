"use client";

import { useId, useState } from "react";
import { ButtonLink, cn } from "@/shared/ui";

type Door = "wall" | "library";

const DOORS: ReadonlyArray<{ id: Door; number: number; label: string }> = [
  { id: "wall", number: 1, label: "Listen to what others never said" },
  { id: "library", number: 2, label: "Step into a story that answers to you" },
];

// The homepage's own first choice. Each door previews its room in a polite live region,
// and every preview ends in a real link, so no choice is required to navigate.
export function TwoDoors() {
  const [door, setDoor] = useState<Door | null>(null);
  const previewId = useId();
  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <ul className="m-0 flex list-none flex-col gap-3 p-0 lg:w-1/2">
        {DOORS.map((item) => {
          const pressed = door === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={pressed}
                aria-controls={previewId}
                onClick={() => setDoor(item.id)}
                className={cn(
                  "flex min-h-16 w-full items-baseline gap-5 border px-5 py-5 text-left font-display text-[clamp(1.375rem,3vw,1.75rem)] leading-tight text-text transition-colors duration-[var(--motion-feedback)] hover:border-accent",
                  pressed ? "border-accent bg-surface" : "border-control-border",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-5 shrink-0 italic",
                    pressed ? "text-accent" : "text-text-secondary",
                  )}
                >
                  {item.number}
                </span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div id={previewId} aria-live="polite" className="lg:min-h-72 lg:w-1/2">
        {door === null ? (
          <p className="m-0 pt-6 font-reading text-reading-compact text-text-secondary">
            Choose a door to look inside.
          </p>
        ) : null}
        {door === "wall" ? (
          <div className="flex animate-rise flex-col gap-5">
            <p className="m-0 text-label font-bold tracking-[0.14em] text-text-secondary uppercase">
              The Whisper Wall
            </p>
            <blockquote className="m-0 border-l-2 border-mood-longing pl-5">
              <p className="m-0 font-display text-[1.625rem] leading-snug font-light italic">
                Some nights I still check whether your light is on.
              </p>
              <p className="m-0 mt-2.5 text-label font-bold tracking-[0.14em] text-mood-longing uppercase">
                Longing · today
              </p>
            </blockquote>
            <p className="m-0 border border-rule bg-surface px-4 py-3.5 text-ui text-text-body">
              Heavy letters are sealed. You open them only if you choose.
            </p>
            <ButtonLink href="/wall" className="self-start">
              Enter the Wall
            </ButtonLink>
          </div>
        ) : null}
        {door === "library" ? (
          <div className="flex animate-rise flex-col gap-5">
            <p className="m-0 text-label font-bold tracking-[0.14em] text-text-secondary uppercase">
              The Library
            </p>
            <p className="m-0 font-display text-[1.625rem] leading-snug italic">
              A letter arrives through a letterbox that was nailed shut years ago. What does Mara
              do?
            </p>
            <p className="m-0 text-ui text-text-body">
              Four endings. Every choice is kept, so you can return for the paths you left.
            </p>
            <ButtonLink href="/stories/the-letter-at-number-nine/read" className="self-start">
              Open the story
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
