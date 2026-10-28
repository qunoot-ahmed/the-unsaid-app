"use client";

import { useId, useState } from "react";
import { cn } from "@/shared/ui";
import type { InkSegment } from "../content";

// The Lifted Ink (DESIGN.md). One labelled button reveals every inked phrase for every input
// method. Hovering one phrase also reveals it, but only on devices that report hover.
// The sentence is real text: screen readers read it in full, inked or not.
export function LiftedInk({ segments }: { segments: ReadonlyArray<InkSegment> }) {
  const [lifted, setLifted] = useState(false);
  const descriptionId = useId();

  return (
    <div className="flex flex-col gap-10">
      <p className="m-0 font-display text-[clamp(2.125rem,6vw,4.375rem)] leading-[1.14] font-light tracking-[-0.01em] italic">
        {segments.map((segment, index) => {
          if (!segment.inked) return <span key={index}>{segment.text}</span>;
          // Phrases lift one after another: the delay follows the phrase's order among inked phrases.
          const delay = segments.slice(0, index).filter((previous) => previous.inked).length * 140;
          return (
            // The ink is a background on each line fragment (box-decoration-break: clone), so phrases
            // that wrap are inked on every line. While inked, the text is transparent on screen only.
            <span
              key={index}
              data-inked={lifted ? "false" : "true"}
              style={{ ["--ink-delay" as string]: `${delay}ms` }}
              className={cn(
                "box-decoration-clone bg-no-repeat [background-image:linear-gradient(var(--color-control-border),var(--color-control-border))] [background-position:0_60%]",
                "transition-[background-size,color] delay-[var(--ink-delay)] duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]",
                lifted
                  ? "[background-size:0%_80%] text-link"
                  : "[background-size:100%_80%] text-transparent hover:[background-size:0%_80%] hover:text-text hover:delay-0",
              )}
            >
              {segment.text}
            </span>
          );
        })}
      </p>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="button"
          aria-pressed={lifted}
          aria-describedby={descriptionId}
          onClick={() => setLifted((value) => !value)}
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 border border-control-border px-5 text-ui font-bold text-text hover:border-accent aria-pressed:border-accent aria-pressed:text-accent sm:w-auto"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 9h14M2 5h9M2 13h6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {lifted ? "Let the ink settle" : "Lift the ink"}
        </button>
        <span id={descriptionId} className="sr-only">
          Reveals the inked phrases. Screen readers already read the full sentence.
        </span>
        <span aria-hidden="true" className="text-help text-text-secondary">
          <span className="hidden pointer-fine:inline">
            Rest your pointer on a mark, or lift all the ink.
          </span>
          <span className="pointer-fine:hidden">Tap Lift the ink to read what is underneath.</span>
        </span>
      </div>
    </div>
  );
}
