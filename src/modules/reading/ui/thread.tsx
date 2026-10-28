import type { ThreadStep } from "../domain/reader-view";

// The Thread is an ordered list of the reader's choices. Knots and dotted marks for untaken
// paths are decoration on the list markers and are hidden from assistive technology.
export function Thread({
  steps,
  position,
}: {
  steps: ReadonlyArray<ThreadStep>;
  position: string;
}) {
  return (
    <ol className="m-0 flex list-none flex-col p-0" aria-label="Your thread">
      {steps.map((step, index) => (
        <li key={`${index}-${step.label}`} className="relative flex gap-4 pb-6">
          <span aria-hidden="true" className="relative w-6 shrink-0">
            <span className="absolute top-1 left-[7px] size-2.5 rounded-full bg-accent" />
            <span className="absolute top-3.5 -bottom-1 left-[11px] w-0.5 origin-top animate-rise bg-accent" />
            {Array.from({ length: step.untaken }, (_, mark) => (
              <span
                key={mark}
                className="absolute top-2 left-3 w-4 origin-left border-t border-dotted border-text-secondary"
                style={{ transform: `rotate(${mark % 2 === 0 ? -32 : 32}deg)` }}
              />
            ))}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-help leading-snug text-text-body">{step.label}</span>
            {step.chapter ? (
              <span className="text-label text-text-secondary">{step.chapter}</span>
            ) : null}
            <span className="sr-only">
              {step.untaken === 1 ? "1 path not taken" : `${step.untaken} paths not taken`}
            </span>
          </span>
        </li>
      ))}
      <li className="relative flex gap-4">
        <span aria-hidden="true" className="relative w-6 shrink-0">
          <span className="absolute top-0.5 left-1 size-4 rounded-full border-2 border-accent bg-ground" />
        </span>
        <span className="text-help font-bold text-accent">{position}</span>
      </li>
    </ol>
  );
}
