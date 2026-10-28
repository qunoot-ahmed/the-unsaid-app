import type { ReactNode } from "react";
import { cn } from "./cn";

export interface RadioCardOption<T extends string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  /** Optional decoration before the label, for example a mood mark. */
  mark?: ReactNode;
}

interface RadioCardsProps<T extends string> {
  name: string;
  legend: ReactNode;
  options: ReadonlyArray<RadioCardOption<T>>;
  value: T | null;
  onChange: (value: T) => void;
  layout?: "wrap" | "stack";
}

// A native radio group styled as cards. Native inputs keep arrow-key navigation and
// screen reader semantics; the card is the label, so the whole card is the target.
export function RadioCards<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  layout = "stack",
}: RadioCardsProps<T>) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-4 p-0 font-display text-display-5 italic">{legend}</legend>
      <div className={cn("flex gap-2", layout === "wrap" ? "flex-wrap" : "flex-col")}>
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const checked = value === option.value;
          return (
            <div key={option.value} className="relative">
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="peer absolute size-px opacity-0"
              />
              <label
                htmlFor={id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-start gap-3 border px-4 py-3 text-ui text-text-body",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent",
                  checked
                    ? "border-accent bg-surface text-text"
                    : "border-control-border hover:border-text-secondary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1 size-4 shrink-0 rounded-full border-[1.5px]",
                    checked ? "border-[5px] border-accent" : "border-text-secondary",
                  )}
                />
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-2.5 font-bold">
                    {option.mark}
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="text-help font-normal text-text-secondary">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
