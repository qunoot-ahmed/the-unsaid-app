import { cn } from "@/shared/ui";
import { foldBody, readingMinutes, shouldFold, type LetterSummary } from "../domain/letters";
import { FoldedLetter } from "./folded-letter";
import { LetterMeta } from "./mood-mark";
import { Reactions } from "./reactions";
import { SealedLetter } from "./sealed-letter";

// Typographic treatment by length, as on the approved Wall: very short letters are set heavy and
// upright, short ones in light italic, and slightly longer ones upright in the display face.
function displayTreatment(length: number): string | null {
  if (length <= 60) {
    return "max-w-[16ch] text-[clamp(2.125rem,6vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.015em]";
  }
  if (length <= 100) {
    return "max-w-[22ch] text-[clamp(1.75rem,5vw,2.625rem)] leading-[1.16] font-light italic";
  }
  if (length <= 150) {
    return "max-w-[28ch] text-[clamp(1.375rem,3.5vw,1.875rem)] leading-[1.3] font-normal";
  }
  return null;
}

function OpenBody({ body }: { body: string }) {
  if (shouldFold(body)) {
    const { visible, remainder } = foldBody(body);
    return <FoldedLetter visible={visible} remainder={remainder} minutes={readingMinutes(body)} />;
  }
  const treatment = displayTreatment(body.length);
  if (treatment) {
    return <p className={cn("m-0 font-display text-balance", treatment)}>{body}</p>;
  }
  return (
    <p className="m-0 max-w-[60ch] font-reading text-reading-compact leading-[1.7] text-text-body md:text-reading">
      {body}
    </p>
  );
}

export function LetterSlip({ letter, offset }: { letter: LetterSummary; offset: boolean }) {
  return (
    <article
      aria-label={`Letter number ${letter.catalogueMark}`}
      className={cn(
        "flex animate-rise flex-col gap-4.5 border-t border-rule py-10 break-words md:py-13",
        offset && "md:ml-18",
      )}
    >
      <LetterMeta catalogueMark={letter.catalogueMark} mood={letter.mood} day={letter.day} />
      {letter.kind === "open" ? (
        <OpenBody body={letter.body} />
      ) : (
        <SealedLetter id={letter.id} contentNote={letter.contentNote} />
      )}
      <Reactions counts={letter.reactionCounts} />
    </article>
  );
}
