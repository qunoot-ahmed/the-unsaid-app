"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Button, ErrorNotice, Ornament, SmallCaps } from "@/shared/ui";
import type { ReaderView } from "../domain/reader-view";
import { chooseInDemoStory, restartDemoStory } from "../server/reader-actions";
import { ChoiceList } from "./choice-list";
import { EndingsFound } from "./endings-found";
import { Thread } from "./thread";

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// Demonstration reader. The server owns the story graph; the page holds only the reader's own
// path, which is not saved (persistent progress arrives in Milestone 6).
export function Reader({ initialView }: { initialView: ReaderView }) {
  const [view, setView] = useState(initialView);
  const [path, setPath] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"ink" | "parchment">("ink");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // After a choice, focus moves to the new scene heading (DESIGN.md, interaction rules).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [view.scene.key]);

  const choose = useCallback(
    (choiceId: string) => {
      setError(null);
      startTransition(async () => {
        const result = await chooseInDemoStory(path, completed, choiceId);
        // Updates after an await must be marked as a transition again, so the new scene and the
        // end of the pending state commit together and the choices are never shown disabled.
        startTransition(() => {
          if (!result.ok) {
            setError(result.message);
            return;
          }
          setView(result.view);
          setPath(result.path);
          setCompleted(result.completed);
        });
      });
    },
    [path, completed],
  );

  function restart() {
    setError(null);
    startTransition(async () => {
      const result = await restartDemoStory(completed);
      startTransition(() => {
        if (result.ok) {
          setView(result.view);
          setPath(result.path);
          setCompleted(result.completed);
        } else {
          setError(result.message);
        }
      });
    });
  }

  const { scene } = view;
  const position = scene.isEnding ? `Ending: ${scene.title}` : `You are here: ${scene.title}`;
  const progress = scene.isEnding ? 100 : Math.min(90, 40 + path.length * 25);

  return (
    <div
      data-theme={theme === "parchment" ? "parchment" : undefined}
      className="min-h-dvh bg-ground text-text"
    >
      <div
        role="progressbar"
        aria-label="Story progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-0.5 bg-rule"
      >
        <div
          className="h-0.5 bg-accent transition-[width] duration-[var(--motion-discover)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2.5 text-text no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="font-display text-[1.1875rem] italic">{view.storyTitle}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={theme === "parchment"}
              onClick={() => setTheme((value) => (value === "ink" ? "parchment" : "ink"))}
              className="inline-flex min-h-11 items-center gap-2 border border-control-border px-3 text-help text-text hover:border-accent aria-pressed:border-accent aria-pressed:text-accent"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" />
              </svg>
              Parchment theme
            </button>
            <button
              type="button"
              aria-pressed={saved}
              aria-label="Save this story (demonstration, not stored)"
              onClick={() => setSaved((value) => !value)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center border border-control-border text-text hover:border-accent aria-pressed:border-accent aria-pressed:text-accent"
            >
              <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
                <path
                  d="M2 1h10v14l-5-4-5 4z"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-10 px-4 pt-8 pb-24 md:flex-row-reverse md:justify-end md:gap-16 md:px-8 md:pt-18">
        <main id="main" className="min-w-0 md:max-w-[42.5rem] md:flex-1">
          <p role="status" className="sr-only">
            {pending
              ? "Opening the next scene"
              : view.lastChoice
                ? `You chose to ${lowerFirst(view.lastChoice)}. ${scene.title}.`
                : ""}
          </p>
          <article key={scene.key} className="animate-rise">
            {view.lastChoice ? (
              <p className="m-0 mb-10 font-display text-[1.1875rem] text-text-secondary italic">
                You chose to {lowerFirst(view.lastChoice)}.
              </p>
            ) : null}
            <SmallCaps className="text-accent">
              {scene.isEnding ? "An ending" : scene.chapter}
            </SmallCaps>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 mb-8 font-display text-[clamp(2.375rem,6vw,3.5rem)] leading-[1.05] font-normal italic md:mb-10"
            >
              {scene.title}
            </h1>
            <div className="flex flex-col gap-5 font-reading text-reading-compact leading-[1.7] text-text-body md:text-reading">
              {scene.paragraphs.map((paragraph) => (
                <p key={paragraph} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {scene.isEnding ? null : <Ornament />}

          {error ? (
            <div className="mb-6">
              <ErrorNotice title="That choice could not be saved to your thread.">
                {error}
              </ErrorNotice>
            </div>
          ) : null}

          {scene.isEnding ? (
            <section
              aria-labelledby="ending-heading"
              className="mt-12 flex flex-col gap-5 border border-rule bg-surface p-6 md:p-8"
            >
              <h2
                id="ending-heading"
                className="m-0 font-display text-display-5 font-normal italic"
              >
                You found an ending.
              </h2>
              <p className="m-0 text-help text-text-secondary">
                Endings you find are kept when you start again.
              </p>
              <Button
                onClick={restart}
                pending={pending}
                pendingLabel="Starting again"
                className="self-start"
              >
                Follow another thread
              </Button>
            </section>
          ) : (
            <ChoiceList
              prompt={scene.prompt ?? "What happens next?"}
              choices={scene.choices}
              disabled={pending}
              onChoose={choose}
            />
          )}
        </main>

        <aside aria-label="Your reading" className="flex flex-col gap-8 md:w-60 md:shrink-0">
          <details className="group border-y border-rule md:border-0" open>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between md:pointer-events-none">
              <span className="text-label font-bold tracking-[0.14em] text-text-secondary uppercase">
                Your thread
              </span>
              <span aria-hidden="true" className="text-help text-text-secondary md:hidden">
                {view.thread.length} choices
              </span>
            </summary>
            <div className="pt-4 pb-2">
              <Thread steps={view.thread} position={position} />
            </div>
          </details>
          <EndingsFound total={view.endings.total} found={view.endings.found} />
          {path.length > 0 && !scene.isEnding ? (
            <button
              type="button"
              onClick={restart}
              disabled={pending}
              className="inline-flex min-h-11 items-center self-start text-help text-text-secondary underline underline-offset-4"
            >
              Start this story again
            </button>
          ) : null}
          <p className="m-0 border-l-2 border-accent pl-3 text-help text-text-secondary">
            Demonstration story. Your thread is kept in this page and is not saved.
          </p>
        </aside>
      </div>
    </div>
  );
}
