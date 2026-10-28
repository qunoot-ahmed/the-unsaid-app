"use client";

import { useId, useState } from "react";

interface FoldedLetterProps {
  visible: string;
  remainder: string;
  minutes: number;
}

// Folding is a readability aid applied by the interface. The remainder is not rendered while
// folded, so screen readers do not hear half of the letter.
export function FoldedLetter({ visible, remainder, minutes }: FoldedLetterProps) {
  const [unfolded, setUnfolded] = useState(false);
  const regionId = useId();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-[60ch] flex-col gap-4 font-reading text-reading-compact leading-[1.7] text-text-body md:text-reading">
        <p className="m-0">
          {visible}
          {unfolded ? null : <span aria-hidden="true"> ...</span>}
        </p>
        <div id={regionId}>
          {unfolded ? <p className="m-0 origin-top animate-unfold">{remainder}</p> : null}
        </div>
      </div>
      {unfolded ? null : (
        <div aria-hidden="true" className="-mt-2 border-t border-dashed border-control-border" />
      )}
      <button
        type="button"
        aria-expanded={unfolded}
        aria-controls={regionId}
        onClick={() => setUnfolded((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2.5 self-start text-ui font-bold text-accent"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d={unfolded ? "M2 11l6-6 6 6" : "M2 5l6 6 6-6"}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        {unfolded ? "Fold it back" : `Unfold the rest · ${minutes} min`}
      </button>
    </div>
  );
}
