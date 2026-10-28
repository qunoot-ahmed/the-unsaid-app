"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, useState, useTransition } from "react";
import {
  Button,
  ErrorNotice,
  RadioCards,
  SmallCaps,
  StatusLine,
  TextArea,
  type RadioCardOption,
} from "@/shared/ui";
import {
  BODY_MAX,
  composerReducer,
  initialComposerState,
  type ComposerEvent,
  type Visibility,
} from "../domain/composer";
import { CONTENT_NOTES, type ContentNote } from "../domain/letters";
import { MOOD_IDS, MOODS, type MoodId } from "../domain/moods";
import { previewRelease } from "../server/demo-actions";
import { MoodLabel, MoodRule } from "./mood-mark";

const moodOptions: ReadonlyArray<RadioCardOption<MoodId>> = MOOD_IDS.map((id) => ({
  value: id,
  label: MOODS[id].label,
  mark: <MoodRule mood={id} size="small" />,
}));

const visibilityOptions: ReadonlyArray<RadioCardOption<Visibility>> = [
  {
    value: "open",
    label: "Open letter",
    description: "Anyone on the Wall reads it as they scroll.",
  },
  {
    value: "sealed",
    label: "Sealed letter",
    description: "Readers see a short note first and choose whether to open it.",
  },
];

// The Letter (DESIGN.md). Milestone 1 is a preview: the server validates the draft but stores
// nothing. "Released" appears only after the server responds; no step waits for an animation.
export function Composer() {
  const [state, dispatch] = useReducer(composerReducer, undefined, () => initialComposerState());
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [previewMark, setPreviewMark] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const { step, draft, errors } = state;
  const isSealStep = step === "sealing" || step === "publishing" || step === "failed";

  // Move focus to the new step's heading so keyboard and screen reader users follow along.
  const previousStep = useRef(step);
  useEffect(() => {
    if (
      previousStep.current !== step &&
      (step === "sealing" || step === "released" || step === "writing")
    ) {
      stepHeadingRef.current?.focus();
    }
    previousStep.current = step;
  }, [step]);

  function send(event: ComposerEvent) {
    dispatch(event);
  }

  function release() {
    const next = composerReducer(state, { type: "submit" });
    dispatch({ type: "submit" });
    if (next.step !== "publishing") return;
    startTransition(async () => {
      const result = await previewRelease(next.draft, simulateFailure);
      if (result.ok) {
        setPreviewMark(result.catalogueMark);
        dispatch({ type: "serverConfirmed" });
      } else if (result.kind === "invalid") {
        dispatch({ type: "serverRejected", errors: result.errors });
      } else {
        dispatch({ type: "serverFailed", message: result.message });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-[47.5rem] px-4 pt-10 pb-24 md:px-8">
      <p className="m-0 mb-8 border-l-2 border-accent pl-3 text-help text-text-secondary">
        Preview mode. Your letter is checked by the server but never stored or published.
      </p>

      {step === "writing" ? (
        <section aria-labelledby="writing-heading" className="flex flex-col gap-6">
          <h1
            id="writing-heading"
            ref={stepHeadingRef}
            tabIndex={-1}
            className="m-0 font-display text-display-4 font-normal italic md:text-display-3"
          >
            A letter, unsigned
          </h1>
          <div className="border border-rule bg-sheet px-5 py-8 md:px-14 md:py-12">
            <p
              aria-hidden="true"
              className="m-0 mb-6 font-display text-[1.375rem] text-text-secondary italic"
            >
              To no one in particular,
            </p>
            <TextArea
              id="letter-body"
              label="Your letter"
              rows={10}
              maxLength={BODY_MAX}
              value={draft.body}
              onChange={(event) => send({ type: "edit", body: event.target.value })}
              placeholder="Write what you have never said."
              error={errors.body}
              help={`${draft.body.length} of ${BODY_MAX} characters. Others will see it as Anonymous.`}
              bare
              className="text-reading-compact leading-[1.75] md:text-[1.375rem]"
            />
          </div>
          <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a href="#support" className="text-help text-text-secondary">
              If you are struggling, you do not have to carry it alone
            </a>
            <Button size="large" onClick={() => send({ type: "continue" })}>
              Seal this letter
            </Button>
          </div>
        </section>
      ) : null}

      {isSealStep ? (
        <section aria-labelledby="seal-heading" className="flex flex-col gap-10">
          <h1
            id="seal-heading"
            ref={stepHeadingRef}
            tabIndex={-1}
            className="m-0 font-display text-display-4 font-normal italic md:text-display-3"
          >
            Seal the letter
          </h1>
          <div className="flex flex-col gap-2">
            <RadioCards
              name="mood"
              legend="How does it feel?"
              layout="wrap"
              options={moodOptions}
              value={draft.mood}
              onChange={(mood) => send({ type: "setMood", mood })}
            />
            {errors.mood ? (
              <p role="alert" className="m-0 text-help text-danger">
                {errors.mood}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <RadioCards
              name="visibility"
              legend="Who may read it?"
              options={visibilityOptions}
              value={draft.visibility}
              onChange={(visibility) => send({ type: "setVisibility", visibility })}
            />
            {draft.visibility === "sealed" ? (
              <div className="flex flex-col gap-2 pl-0 sm:pl-7">
                <label htmlFor="content-note" className="text-help font-bold">
                  What should readers know first?
                </label>
                <select
                  id="content-note"
                  value={draft.contentNote ?? ""}
                  aria-invalid={errors.contentNote ? true : undefined}
                  aria-describedby={errors.contentNote ? "content-note-error" : undefined}
                  onChange={(event) =>
                    send({ type: "setContentNote", contentNote: event.target.value as ContentNote })
                  }
                  className="min-h-12 border border-control-border bg-surface px-3 text-[1rem] text-text aria-invalid:border-danger"
                >
                  <option value="" disabled>
                    Choose a content note
                  </option>
                  {CONTENT_NOTES.map((note) => (
                    <option key={note} value={note}>
                      {note}
                    </option>
                  ))}
                </select>
                {errors.contentNote ? (
                  <p id="content-note-error" role="alert" className="m-0 text-help text-danger">
                    {errors.contentNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <SmallCaps className="text-text-secondary">Exactly what others will see</SmallCaps>
            <div className="flex flex-col gap-4 border border-rule bg-sheet p-6 md:p-8">
              <p className="m-0 flex flex-wrap items-center gap-3">
                {draft.mood ? (
                  <>
                    <MoodRule mood={draft.mood} />
                    <MoodLabel mood={draft.mood} />
                  </>
                ) : (
                  <SmallCaps className="text-text-secondary">Choose a mood</SmallCaps>
                )}
                <SmallCaps className="font-normal text-text-secondary">
                  Shown as: Anonymous · today
                </SmallCaps>
              </p>
              {draft.visibility === "sealed" ? (
                <p className="m-0 text-ui font-bold">
                  Sealed by the writer · {draft.contentNote ?? "content note not chosen"}
                </p>
              ) : (
                <p className="m-0 font-reading text-reading-compact leading-[1.7] break-words text-text-body">
                  {draft.body}
                </p>
              )}
            </div>
          </div>

          {step === "failed" ? (
            <ErrorNotice title="We could not release your letter.">
              {state.failureMessage ?? "Something went wrong on our side."} Nothing was published.
            </ErrorNotice>
          ) : null}

          <label className="flex min-h-11 items-center gap-3 text-help text-text-secondary">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(event) => setSimulateFailure(event.target.checked)}
              className="size-5 accent-[var(--color-accent)]"
            />
            Demonstration: simulate a server failure
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="large"
              onClick={release}
              pending={step === "publishing"}
              pendingLabel="Releasing"
            >
              {step === "failed" ? "Try again" : "Release it"}
            </Button>
            <Button
              size="large"
              variant="secondary"
              onClick={() => send({ type: "back" })}
              disabled={step === "publishing"}
            >
              Back to the letter
            </Button>
          </div>
          <StatusLine>
            {step === "publishing" ? "Releasing your letter. Waiting for confirmation." : ""}
          </StatusLine>
        </section>
      ) : null}

      {step === "released" ? (
        <section
          aria-labelledby="released-heading"
          className="flex animate-rise flex-col gap-6 py-10"
        >
          <span aria-hidden="true" className="block h-0.5 w-10 bg-accent" />
          <h1
            id="released-heading"
            ref={stepHeadingRef}
            tabIndex={-1}
            className="m-0 font-display text-display-2 leading-none font-light italic"
          >
            Released.
          </h1>
          <p className="m-0 font-reading text-reading-compact leading-relaxed text-text-body">
            In preview mode nothing was published or saved. When release is live, this letter would
            appear on the Wall as No. {previewMark}, without your name.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/wall"
              className="inline-flex min-h-13 items-center justify-center border border-text bg-text px-6 font-bold text-ground no-underline"
            >
              See the Wall
            </Link>
            <Button size="large" variant="secondary" onClick={() => send({ type: "startAgain" })}>
              Write another
            </Button>
          </div>
        </section>
      ) : null}

      <aside id="support" className="mt-16 border-t border-rule pt-6 text-help text-text-secondary">
        If you are in danger or thinking about harming yourself, contact your local emergency number
        now. Support resources by country will be listed here before launch.
      </aside>
    </div>
  );
}
