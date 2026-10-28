import { MoodRule } from "@/modules/confessions";
import { HOMEPAGE_CONFESSION, LiftedInk, TwoDoors } from "@/modules/home";
import { SmallCaps } from "@/shared/ui";

export default function HomePage() {
  return (
    <main id="main" className="mx-auto max-w-[var(--content-max)] px-4 md:px-8">
      <section className="flex flex-col gap-8 pt-14 pb-24 md:flex-row md:gap-12 md:pt-28 md:pb-30">
        <div className="flex flex-col gap-2.5 md:w-60 md:shrink-0 md:pt-6">
          <MoodRule mood={HOMEPAGE_CONFESSION.mood} />
          <SmallCaps className="text-mood-regret">Regret</SmallCaps>
          <SmallCaps className="font-normal text-text-secondary">Anonymous · today</SmallCaps>
        </div>
        <div className="min-w-0 max-w-[58.75rem] flex-1">
          <LiftedInk segments={HOMEPAGE_CONFESSION.segments} />
          <div className="mt-16 flex max-w-[32.5rem] flex-col gap-3 md:mt-24">
            <h1 className="m-0 text-label font-bold tracking-[0.14em] text-accent uppercase">
              Some stories are written. Others are confessed.
            </h1>
            <p className="m-0 font-reading text-reading-compact leading-relaxed text-text-body md:text-[1.1875rem]">
              People leave here what they never said aloud. Others come for stories that change with
              every choice they make.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="begin"
        className="flex flex-col gap-10 border-t border-control-border pt-14 pb-24 md:flex-row md:gap-12"
      >
        <div className="md:w-60 md:shrink-0">
          <h2
            id="begin"
            className="m-0 font-display text-display-4 leading-tight font-normal italic md:text-[2.25rem]"
          >
            Where will you begin?
          </h2>
          <p className="m-0 mt-3.5 text-help leading-normal text-text-secondary">
            Your first choice. You can always come back for the other.
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <TwoDoors />
        </div>
      </section>

      <p className="m-0 border-t border-rule py-8 text-help leading-relaxed text-text-secondary">
        Confessions are shown without your name, profile or account. People who know you may still
        recognise your voice.
      </p>
    </main>
  );
}
