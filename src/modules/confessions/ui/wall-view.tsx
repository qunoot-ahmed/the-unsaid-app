import { ButtonLink, EmptyState, SmallCaps } from "@/shared/ui";
import type { LetterSummary } from "../domain/letters";
import { ALL_ROOMS_LINE, MOODS, type MoodId } from "../domain/moods";
import { LetterSlip } from "./letter-slip";
import { MoodRooms } from "./mood-rooms";

interface WallViewProps {
  mood: MoodId | null;
  letters: ReadonlyArray<LetterSummary>;
}

export function WallView({ mood, letters }: WallViewProps) {
  const roomName = mood ? MOODS[mood].label : "All rooms";
  const roomLine = mood ? MOODS[mood].roomLine : ALL_ROOMS_LINE;
  return (
    <div data-mood={mood ?? undefined}>
      <div
        aria-hidden="true"
        className="h-0.5 bg-accent transition-colors duration-[var(--motion-state)]"
      />
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-10 px-4 pt-10 pb-24 md:flex-row md:gap-14 md:px-8 md:pt-16">
        <aside className="flex flex-col gap-6 md:w-52 md:shrink-0">
          <p className="m-0 border-l-2 border-accent pl-3 text-help text-text-secondary">
            Demonstration Wall with fictional letters. Reactions and opened seals are not saved.
          </p>
          <MoodRooms current={mood} />
        </aside>

        <main id="main" className="min-w-0 flex-1 md:max-w-[47.5rem]">
          <header aria-live="polite" className="pb-10">
            <SmallCaps className="text-accent">{roomName}</SmallCaps>
            <h1 className="mt-3 mb-0 font-display text-[clamp(2.125rem,5vw,3.25rem)] leading-[1.05] font-light italic">
              {roomLine}
            </h1>
          </header>
          {letters.length === 0 ? (
            <EmptyState
              title="Nothing in this room yet."
              action={
                <ButtonLink href="/write" variant="secondary">
                  Write a letter
                </ButtonLink>
              }
            >
              Be the first to leave something here. It will carry no name.
            </EmptyState>
          ) : (
            letters.map((letter, index) => (
              <LetterSlip key={letter.id} letter={letter} offset={index % 2 === 1} />
            ))
          )}
        </main>

        <aside aria-labelledby="unsaid-prompt" className="flex flex-col gap-4 md:w-56 md:shrink-0">
          <h2 id="unsaid-prompt" className="m-0 font-display text-display-5 font-normal italic">
            Something unsaid?
          </h2>
          <p className="m-0 font-reading text-help leading-relaxed text-text-secondary">
            Write it as a letter. Seal it if it is heavy.
          </p>
          <ButtonLink href="/write" className="self-start">
            Write a letter
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
