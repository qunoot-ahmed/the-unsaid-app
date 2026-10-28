"use client";

import { useEffect, useRef } from "react";

interface ChoiceListProps {
  prompt: string;
  choices: ReadonlyArray<{ id: string; label: string }>;
  disabled: boolean;
  onChoose: (choiceId: string) => void;
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

// Choices are buttons in a list. Number keys 1 to 4 choose while the list is shown (DESIGN.md).
export function ChoiceList({ prompt, choices, disabled, onChoose }: ChoiceListProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        disabled ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTypingTarget(event.target)
      )
        return;
      const index = Number.parseInt(event.key, 10) - 1;
      const choice = Number.isInteger(index) ? choices.at(index) : undefined;
      if (choice && index >= 0 && index < 4) {
        event.preventDefault();
        onChoose(choice.id);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    // Marks that number keys work, which is only true once the page has hydrated.
    const section = sectionRef.current;
    if (section) section.dataset.shortcuts = "on";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (section) delete section.dataset.shortcuts;
    };
  }, [choices, disabled, onChoose]);

  return (
    <section ref={sectionRef} aria-labelledby="choice-prompt" className="flex flex-col gap-4">
      <h2 id="choice-prompt" className="m-0 font-display text-display-4 font-normal">
        {prompt}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {choices.map((choice, index) => (
          <li key={choice.id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChoose(choice.id)}
              className="group flex min-h-16 w-full items-baseline gap-5 border border-control-border px-5 py-4 text-left font-reading text-reading-compact leading-snug text-text transition-colors duration-[var(--motion-feedback)] hover:border-accent hover:bg-surface disabled:cursor-wait disabled:opacity-70 md:text-reading"
            >
              <span
                aria-hidden="true"
                className="w-5 shrink-0 font-display text-[1.375rem] text-text-secondary italic group-hover:text-accent"
              >
                {index + 1}
              </span>
              <span>{choice.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="m-0 text-help text-text-secondary">
        Press 1 to {choices.length} to choose. Each choice is kept in your thread. You can start
        again at any time.
      </p>
    </section>
  );
}
